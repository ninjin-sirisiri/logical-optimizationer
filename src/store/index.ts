import { store } from '@simplestack/store';

import type { Circuit, GateType } from '../core/circuit/types';
import type { OptimizationResult } from '../core/optimizer/types';
import type { TruthTable } from '../core/truth-table/types';

export type OptimizationMode = 'SOP' | 'POS';
export type GateSet = 'default' | 'nand' | 'nor' | 'custom';

export type InputMode = 'expression' | 'table';

export interface AppState {
  expression: string;
  inputMode: InputMode;
  truthTable: TruthTable | null;
  results: {
    optimizedExpression: string | null;
    detailedResults: OptimizationResult[] | null;
    circuit: Circuit | null;
  };
  options: {
    mode: OptimizationMode;
    gateSet: GateSet;
    enabledGates: Record<GateType, boolean>;
  };
}

const initialState: AppState = {
  expression: '',
  inputMode: 'expression',
  truthTable: null,
  results: {
    optimizedExpression: null,
    detailedResults: null,
    circuit: null,
  },
  options: {
    mode: 'SOP',
    gateSet: 'default',
    enabledGates: {
      and: true,
      or: true,
      not: true,
      nand: true,
      nor: true,
      xor: true,
      xnor: true,
      buf: true,
      vcc: true,
      gnd: true,
    },
  },
};

const STORAGE_KEY = 'logic-optimizer-state';

const loadState = (): AppState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        // Ensure nested objects are merged correctly if needed
        options: {
          ...initialState.options,
          ...parsed.options,
        },
      };
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load state', e);
  }
  return initialState;
};

export const appStore = store(loadState());

// Persistence middleware
appStore.subscribe((state) => {
  try {
    const toSave = {
      expression: state.expression,
      inputMode: state.inputMode,
      options: state.options,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to save state', e);
  }
});
