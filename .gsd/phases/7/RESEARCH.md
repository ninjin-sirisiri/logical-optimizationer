# Research: Truth Table Based Input Definition

## Objective
Enable users to define logic functions directly via a truth table, managing variables and toggling between expression-based and table-based input.

## Current State Analysis
- `AppState` has `expression` (string) and `truthTable` (null or TruthTable object).
- `TruthTable` contains `inputVariables`, `outputVariables`, and `entries` (Map).
- `useOptimize` hook derives `TruthTable` from `expression` every time.

## Proposed Changes

### 1. Store Update (`src/store/index.ts`)
Add `inputMode` and a way to hold the manual truth table state.
```typescript
export type InputMode = 'expression' | 'table';

export interface AppState {
  inputMode: InputMode;
  expression: string;
  // truthTable is used for display and optimization
  truthTable: TruthTable | null;
  // ... rest
}
```

### 2. Variable Management
- UI to add/remove input variables (e.g., A, B, C).
- UI to add/remove output variables (e.g., Y, Z).
- Default names should be sequential (A, B, C... for inputs, Y, Z... for outputs).

### 3. Truth Table Initialization
When switch to 'table' mode or adding variables:
- Re-generate `entries` Map with all $2^n$ combinations.
- Preserve existing values if variables are added/renamed (optional but nice).
- For new entries, default output value should be `false` (0).

### 4. UI Components
- **VariableEditor**: A small panel to manage variables.
- **TruthTableEditor**: Existing component needs to be enhanced (it's already editable in `src/components/table/TruthTableEditor.tsx` but needs to sync with store correctly).
- **ModeToggle**: Tabs or Button group to switch between "Logic Expression" and "Truth Table".

## Potential Issues
- **Exponential Growth**: Limit input variables to a reasonable number (e.g., 8-10) to prevent UI lag. 2^10 = 1024 rows.
- **Conversion Consistency**: If switching from Expression to Table, populate the table with expression results. If switching from Table to Expression, maybe generate SOP? (Optional: SPEC doesn't strictly require automatic sync).

## Implementation Waves
1. **Wave 1**: Store updates, InputMode toggle, and Variable Management UI.
2. **Wave 2**: Truth Table initialization and manual editing synchronization.
3. **Wave 3**: Integration with optimization engine and Multi-output support (since Spec mentions it).
