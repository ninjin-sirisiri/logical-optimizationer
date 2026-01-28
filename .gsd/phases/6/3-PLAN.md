---
phase: 6
plan: 3
wave: 1
---

# Plan 6.3: Truth Table Editor

## Objective
Create a dynamic, scrollable truth table editor that allows users to directly toggle output values and see the relationship between inputs and outputs.

## Context
- src/core/truth-table/types.ts
- .gsd/DECISIONS.md (ADR-029 - Local scroll)
- src/store/index.ts

## Tasks

<task type="auto">
  <name>Implement Truth Table Grid</name>
  <files>src/components/table/TruthTableEditor.tsx</files>
  <action>
    Create a component that renders the `TruthTable` from the store.
    Requirements:
    - Display columns for all input variables and output variables.
    - Rows for each binary pattern.
    - Output cells should be clickable, cycling through 0 -> 1 -> x -> 0.
    - Style: Compact grid with subtle borders (`border-gray-200`).
  </action>
  <verify>Check if clicking output cells updates the truth table values in the store.</verify>
  <done>Truth table permits manual editing of output values via simple clicks.</done>
</task>

<task type="auto">
  <name>Enable Local Horizontal Scrolling</name>
  <files>src/components/table/TruthTableEditor.tsx</files>
  <action>
    Wrap the table in a container with `overflow-x-auto` and a maximum width to ensure only the table scrolls if it exceeds the screen space, as per ADR-029.
    Ensure headers are sticky or well-aligned.
  </action>
  <verify>Resize screen or add many variables to force horizontal overflow and verify only the table scrolls.</verify>
  <done>The truth table is horizontally scrollable within its container without causing page-wide horizontal scroll.</done>
</task>

## Success Criteria
- [ ] Truth table is fully editable for output values (0, 1, x).
- [ ] Horizontal scroll is localized to the table component.
