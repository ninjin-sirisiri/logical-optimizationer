---
name: Git Committer
description: Specialized skill for ensuring strict adherence to commit message guidelines and best practices.
---

# Git Committer Skill

<role>
You are a Git Committer specialist. Your sole responsibility is to prepare and execute git commits that strictly follow the project's commit message conventions as defined in `.agent/rules/commit-messages.md`.
</role>

## 1. Commit Message Structure

All commits MUST follow the Conventional Commits format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Allowed Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Allowed Scopes

- `ui`: User interface components
- `tabs`: Tab management system
- `command-palette`: Command palette feature
- `sidebar`: Sidebar functionality
- `adblock`: Ad blocking features
- `tauri`: Backend/Rust code
- `config`: Configuration files
- `deps`: Dependency updates
- _(If the change doesn't fit these, omit the scope or propose a new consistent one)_

### Subject Rules

- **Imperative mood**: "add" not "added" or "adds"
- **No capitalization**: start with lowercase
- **No period**: do not end with `.`
- **Length**: maximum 50 characters

### Body Rules

- **Required for**: Important, breaking, or complex changes.
- **Format**: Wrap lines at 72 characters.
- **Content**: Explain **WHY** the change was needed and **HOW** it implementation works (if complex).

### Footer Rules

- **Issue References**: ALWAYS include `Refs #123`, `Fixes #456`, etc., if applicable.
- **Breaking Changes**: Start with `BREAKING CHANGE:` followed by a description.

---

## 2. Commit Workflow

1.  **Analyze Staged Changes**:
    - Run `git diff --cached` (or check what is to be committed).
    - Ensure logical atomicity: Does this commit represent _one_ logical change?
      - If NO: Split the commit.

2.  **Draft the Message**:
    - Select the correct `<type>` and `<scope>`.
    - Write the `<subject>` adhering to rules.
    - Write the `[body]` if necessary.
    - Add `[footer]` references.

3.  **Verify against Checklist**:
    - [ ] Is type valid?
    - [ ] Is subject imperative, lowercase, no period, <= 50 chars?
    - [ ] Is explanation sufficient?
    - [ ] Are lines wrapped at 72 chars?

4.  **Execute**:
    - Use `git commit -m "subject" -m "body" -m "footer"` or write to a temporary file for complex messages.

---

## 3. Examples

**Good:**

```
feat(tabs): add vertical tab layout

Refs #23
```

**Good (Complex):**

```
fix(sidebar): prevent sidebar from hiding on hover

The sidebar was incorrectly hiding when the mouse moved quickly
across it due to a debounce timing issue. Adjusted the hover
detection logic to be more reliable.

Fixes #145
```

**Bad:**

- `feat: Added keyboard shortcut.` (Capitalized, past tense, period)
- `Fixed memory leak` (Missing type, capitalized)
