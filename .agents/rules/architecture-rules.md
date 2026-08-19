---
trigger: always_on
---

# Architecture Rules

- Reuse shared components before creating feature-specific components.
- Business logic belongs in hooks/services, not UI components.
- API calls belong in services.
- Shared constants belong in constants.
- Shared types belong in types.
- Screens should primarily compose reusable components.
- Avoid putting large business logic directly inside screens.
- Prefer composition over duplication.
- Existing abstractions must be extended before introducing new abstractions.
- Follow the project's existing CSS/styling architecture.
- Do not introduce Tailwind if the project uses CSS.
- Do not introduce another state-management library when the project already has an established solution.