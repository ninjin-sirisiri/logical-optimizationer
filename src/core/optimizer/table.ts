import { Implicant } from './types';

export interface Target {
  pattern: string;
  outputIndex: number;
}

/**
 * Checks if a PI pattern covers a target pattern.
 * e.g., "1-0" covers "110" and "100".
 */
export function covers(piPattern: string, targetPattern: string): boolean {
  if (piPattern.length !== targetPattern.length) return false;
  for (let i = 0; i < piPattern.length; i++) {
    if (piPattern[i] !== '-' && piPattern[i] !== targetPattern[i]) {
      return false;
    }
  }
  return true;
}

export class PITable {
  private matrix: boolean[][]; // [piIndex][targetIndex]
  private piIndices: number[]; // Indices of active PIs
  private targetIndices: number[]; // Indices of active targets

  constructor(
    public pis: Implicant[],
    public targets: Target[],
  ) {
    this.matrix = pis.map((pi) =>
      targets.map((target) => {
        // PI covers target if:
        // 1. Bitwise pattern matches
        // 2. outputMask includes outputIndex
        const mask = 1 << target.outputIndex;
        return (pi.outputMask & mask) !== 0 && covers(pi.pattern, target.pattern);
      }),
    );
    this.piIndices = pis.map((_, i) => i);
    this.targetIndices = targets.map((_, i) => i);
  }

  /**
   * Identifies Essential Prime Implicants (EPIs).
   * An EPI is a PI that is the ONLY cover for at least one target.
   */
  public findEPIs(): number[] {
    const epis = new Set<number>();

    for (const targetIdx of this.targetIndices) {
      const coveringPIs = this.piIndices.filter((piIdx) => this.matrix[piIdx][targetIdx]);
      if (coveringPIs.length === 1) {
        epis.add(coveringPIs[0]);
      }
    }

    return Array.from(epis);
  }

  /**
   * Removes a PI and all targets it covers from the active set.
   */
  public selectPI(piIdx: number): void {
    const coveredTargets = this.targetIndices.filter((tIdx) => this.matrix[piIdx][tIdx]);

    // Remove targets
    this.targetIndices = this.targetIndices.filter((tIdx) => !coveredTargets.includes(tIdx));

    // Remove the PI itself
    this.piIndices = this.piIndices.filter((idx) => idx !== piIdx);
  }

  /**
   * Performs basic table reduction: row/column dominance.
   * Note: In many cases, we just need to select all EPIs first.
   */
  public reduce(): void {
    let changed = true;
    while (changed) {
      changed = false;

      // 1. Select EPIs
      const epis = this.findEPIs();
      if (epis.length > 0) {
        for (const epiIdx of epis) {
          this.selectPI(epiIdx);
        }
        changed = true;
        continue; // Re-evaluate after selection
      }

      // 2. Row dominance (PI dominance)
      // If PI A covers a superset of targets covered by PI B, and A is cheaper/equal cost, B is dominated.
      // For QM, cost is usually inversely proportional to number of '-' in pattern.
      // But simple version: if A covers ALL targets B covers, B can be removed.
      const toRemovePIs: number[] = [];
      for (let i = 0; i < this.piIndices.length; i++) {
        for (let j = 0; j < this.piIndices.length; j++) {
          if (i === j) continue;
          const piA = this.piIndices[i];
          const piB = this.piIndices[j];

          if (this.isDominated(piA, piB)) {
            toRemovePIs.push(piB);
          }
        }
      }

      if (toRemovePIs.length > 0) {
        const uniqueToRemove = Array.from(new Set(toRemovePIs));
        this.piIndices = this.piIndices.filter((idx) => !uniqueToRemove.includes(idx));
        changed = true;
      }

      // 3. Column dominance (Target dominance)
      // If Target A is covered by a subset of PIs that cover Target B, B is dominated (redundant).
      // Wait, if A is covered by {P1, P2} and B is covered by {P1, P2, P3},
      // then covering A automatically satisfies B. So B can be removed.
      const toRemoveTargets: number[] = [];
      for (let i = 0; i < this.targetIndices.length; i++) {
        for (let j = 0; j < this.targetIndices.length; j++) {
          if (i === j) continue;
          const tA = this.targetIndices[i];
          const tB = this.targetIndices[j];

          if (this.isTargetDominated(tA, tB)) {
            toRemoveTargets.push(tB);
          }
        }
      }

      if (toRemoveTargets.length > 0) {
        const uniqueToRemove = Array.from(new Set(toRemoveTargets));
        this.targetIndices = this.targetIndices.filter((idx) => !uniqueToRemove.includes(idx));
        changed = true;
      }
    }
  }

  private isDominated(piAIdx: number, piBIdx: number): boolean {
    // A dominates B if A covers all targets B covers
    for (const tIdx of this.targetIndices) {
      if (this.matrix[piBIdx][tIdx] && !this.matrix[piAIdx][tIdx]) {
        return false;
      }
    }
    // Optional: check cost if coverage is identical.
    return true;
  }

  private isTargetDominated(tAIdx: number, tBIdx: number): boolean {
    // Target B is dominated by A if PIs covering A are a subset of PIs covering B.
    for (const piIdx of this.piIndices) {
      if (this.matrix[piIdx][tAIdx] && !this.matrix[piIdx][tBIdx]) {
        return false;
      }
    }
    return true;
  }

  public getActivePIs(): number[] {
    return [...this.piIndices];
  }

  public getActiveTargets(): number[] {
    return [...this.targetIndices];
  }

  public getMatrix(): boolean[][] {
    return this.matrix;
  }
}
