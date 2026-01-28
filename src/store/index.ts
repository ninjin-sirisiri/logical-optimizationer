import { store } from '@simplestack/store';

import type { Circuit } from '../core/circuit/types';
import type { TruthTable } from '../core/truth-table/types';

export type OptimizationMode = 'SOP' | 'POS';
export type GateSet = 'default' | 'nand' | 'nor';

export interface AppState {
  expression: string;
  truthTable: TruthTable | null;
  results: {
    optimizedExpression: string | null;
    circuit: Circuit | null;
  };
  options: {
    mode: OptimizationMode;
    gateSet: GateSet;
  };
}

const initialState: AppState = {
  expression: '',
  truthTable: null,
  results: {
    optimizedExpression: null,
    circuit: null,
  },
  options: {
    mode: 'SOP',
    gateSet: 'default',
  },
};

export const appStore = store(initialState);
