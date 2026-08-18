# Frontend Refactor — Standing Rules

This file exists so the refactor rules don't need to be repeated every session.
It's loaded automatically as a project instruction (via `CLAUDE.md`).

## Process

- Refactor **one file at a time**, not a big-bang rewrite.
- For each file: propose a plan (what gets extracted where, why) and **wait for
  confirmation before writing any code**. Only skip this step when the change
  is purely mechanical with no open design decisions (e.g. "split this file
  the same way we split the last one").
- After every change: run `npx tsc --noEmit` and `npx expo lint`, fix
  anything introduced, before calling the change done.

## Principles

- **Split bulky files.** A screen file that's grown past a few hundred lines
  (constants, helpers, subcomponents, business-logic state all inline) should
  be broken into: pure constants/helpers, a hook owning state + handlers, and
  small presentational components — leaving the route file as thin
  composition. Pattern: `src/components/training/add-training/` (from
  `add_training.tsx`).
- **No duplicated code across files.** If two files share the same styles,
  layout, or logic, extract the shared part into one component/hook instead
  of copy-pasting. Pattern: `src/components/training/TrainingListView.tsx`
  (shared by `training_list.tsx` and `pending_trainings.tsx`).
- **New components should be reusable and shareable**, not one-off — built so
  other screens can drop them in later, not hard-coded to a single caller.
  Pattern: `src/components/ui/DataTable/` + `src/services/exportService.ts`.
- **Keep the folder architecture clean.** Domain-specific components live
  under `src/components/<domain>/`, generic UI primitives under
  `src/components/ui/`, cross-cutting logic in `src/services/` or
  `src/hooks/`. Don't leave dead files, duplicate-named files, or leftover
  scaffolding behind — delete what a change makes obsolete (e.g. `SidebarMenu.tsx`
  was deleted once the More-menu redesign replaced its only usage).
- **Cap file length at ~80-100 lines.** If a file is growing past that,
  extract the excess into its own component/hook instead of letting it keep
  growing — this applies to new files as they're written, not just existing
  ones being refactored.

## Outstanding audit findings (not yet addressed)

From the full-codebase audit (2026-08-17):

- Dead/scratch files: `src/components/test/starter1.tsx` (208 lines,
  unused), `starter2.tsx` (empty)
- Duplicate `RegisterSheet.tsx` in both `components/bottom-sheet/` and
  `components/common/` — the `bottom-sheet/` one is unused
- Duplicate `DateRangeSelector.tsx` in both `components/calendar/` and
  `components/trainer/dashboard/` — both appear unused
- Leftover default-Expo-template files in `components/` top level, in
  kebab/lowercase naming inconsistent with the rest of the PascalCase domain
  components (`animated-icon.tsx`, `app-tabs.tsx`, `themed-text.tsx`,
  `collapsible.tsx`)
- No Prettier config, only `eslint.config.js` (Expo default)
- `src/app/session_dashboard.tsx` (1092 lines) — refactor plan was discussed
  (extract into `src/components/session-dashboard/` + a `useSessionDashboard`
  hook, mirroring the `add-training` split) but **not yet executed**
- `src/app/assessment_builder.tsx` (472 lines) — not yet reviewed
- `src/components/calendar/Calendar.tsx` (418 lines) — not yet reviewed
- `src/api/mockService.ts` (369 lines) — not yet reviewed
- `src/app/secure_checkin.tsx` (363 lines) — not yet reviewed

## Progress log

- ✅ `add_training.tsx` (912 → ~80 lines): split into
  `src/components/training/add-training/` (constants, formatting, a
  `useAddTrainingForm` hook, 5 section components)
- ✅ Built `src/components/ui/DataTable/` (reusable table: search, sort,
  pagination, column visibility, CSV/Excel/PDF/print/copy export) +
  `src/services/exportService.ts` (generic export primitives, not tied to
  training data)
- ✅ Deduplicated `training_list.tsx` + `pending_trainings.tsx` into shared
  `src/components/training/TrainingListView.tsx`
- ✅ Deleted `SidebarMenu.tsx` (dead code after the More-menu grid redesign)

## Related standing rules (not refactor-specific, but adjacent)

- This app runs entirely on frontend mock data (`src/data/mockData.ts` +
  `src/api/mockService.ts`). Don't reconnect `src/api/*` to a real backend
  without an explicit ask.
- Backend and database code are off-limits for edits entirely — diagnose and
  explain, don't execute changes there.
