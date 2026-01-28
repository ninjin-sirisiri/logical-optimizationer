---
phase: 6
plan: 2
wave: 1
---

# Plan 6.2: Core Shell and Expression Editor

## Objective

Implement the main application layout and the logic expression editor with symbol input helpers, following the Mu minimalist design guidelines using Tailwind CSS v4.

## Context

- .gsd/SPEC.md
- .agent/rules/ui-design-guidelines.md (Mu Design)
- src/store/index.ts (Created in Plan 6.1)

## Tasks

<task type="auto">
  <name>Implement Main Layout Shell</name>
  <files>src/components/layout/Shell.tsx, src/App.tsx</files>
  <action>
    Create a `Shell` component that provides a desktop-first container (min-width 1024px).
    Implement a minimalist header and a main content area using vertical spacing as per guidelines.
    Integrate `Shell` into `App.tsx`.
  </action>
  <verify>Run the dev server and verify the layout structure in the browser.</verify>
  <done>Application has a clean, minimalist shell that respects the 1024px desktop-first constraint.</done>
</task>

<task type="auto">
  <name>Implement Expression Editor</name>
  <files>src/components/editor/ExpressionEditor.tsx</files>
  <action>
    Build an editor component containing:
    - Textarea for expression input (high density, minimalist border).
    - A set of "Helper Buttons" for logic symbols (¬, ・, +, ⊕, (, )).
    - An "Optimize" button that triggers the paring and optimization logic (via the store).
    Connect the textarea to the global store's `expression` field.
  </action>
  <verify>Verify that typing in the textarea or clicking buttons updates the store value.</verify>
  <done>Expression editor allows text entry and symbol insertion via buttons.</done>
</task>

## Success Criteria

- [ ] Application shell follows Mu design guidelines (Tailwind v4 standard values).
- [ ] Expression editor supports both keyboard input and virtual symbol buttons.
