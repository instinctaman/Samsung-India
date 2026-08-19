---
trigger: always_on
---

# Project Development Rules

These rules are ALWAYS ON and must be followed for every coding task.

## 1. Inspect Before Coding

Before making ANY code change:

- Inspect the existing project structure.
- Identify the relevant screen/page/module.
- Search for existing components, hooks, utilities, services, APIs, constants, types, and styles related to the requested feature.
- Read the relevant existing files before implementing anything.
- Never assume that a required component or functionality does not already exist.

## 2. Reuse Existing Code

ALWAYS prefer existing project code over creating new code.

Before creating a new:

- Component
- Screen
- Hook
- Utility
- Service
- API function
- Type
- Constant
- Style file

search the project first.

If an existing implementation can reasonably be reused or extended, MODIFY/REUSE it instead of creating another implementation.

## 3. No Duplicate Files

NEVER create duplicate or replacement files such as:

- ComponentNew
- ComponentV2
- ComponentUpdated
- ScreenNew
- ScreenV2
- helperNew
- utilsNew
- backup files
- temporary files

Do not create another component simply because an existing component needs modification.

## 4. New Files Require Justification

Create a new file ONLY when:

1. No existing file reasonably supports the requirement, AND
2. Reusing/extending an existing file would reduce maintainability or violate separation of concerns.

If creating a new file is necessary, use the existing project's folder structure and naming conventions.

## 5. Reuse Existing Screens

Before creating a screen/page:

- Search existing screens.
- Check routing/navigation.
- Check whether the requested screen already exists under another name.
- Check whether an existing screen can be extended or composed.

Never create a duplicate screen.

## 6. Reuse Existing Components

Before creating a UI component:

- Search for similar components.
- Search by functionality, not only by filename.
- Check shared/common components.
- Check feature-specific components.

Prefer composition and configuration over duplication.

## 7. Reuse Business Logic

Before creating new logic:

- Search existing hooks.
- Search utility functions.
- Search services/API functions.
- Search constants.
- Search types.
- Search existing validation and formatting functions.

Do not duplicate business logic.

## 8. Follow Existing Architecture

Respect the existing:

- Folder structure
- Component architecture
- State management
- API architecture
- Styling approach
- Naming conventions
- Routing structure
- Error-handling patterns
- Validation patterns

Do not introduce a new architecture or library when an existing project solution already exists.

## 9. Minimize Changes

Make the smallest clean change required to solve the task.

Do NOT:

- Refactor unrelated code.
- Rename unrelated files.
- Move unrelated components.
- Replace working architecture unnecessarily.
- Add dependencies without a real requirement.

## 10. Final Verification

Before finishing every task:

- Review the files created.
- Review the files modified.
- Check for duplicate components.
- Check for duplicate business logic.
- Remove unused imports.
- Remove unused code.
- Remove unnecessary files.
- Verify existing functionality is preserved.
- Verify the implementation follows the existing architecture.

## Mandatory Workflow

For EVERY coding task:

INSPECT
→ SEARCH
→ READ
→ REUSE
→ MODIFY
→ CREATE ONLY IF NECESSARY
→ VERIFY

NEVER skip the INSPECT and SEARCH steps.