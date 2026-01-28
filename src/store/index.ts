import { store } from '@simplestack/store';

import type { Circuit } from '../core/circuit/types';
import type { OptimizationResult } from '../core/optimizer/types';
import type { TruthTable } from '../core/truth-table/types';

export type OptimizationMode = 'SOP' | 'POS';
export type GateSet = 'default' | 'nand' | 'nor';

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
  },
};

export const appStore = store(initialState);
