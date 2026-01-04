---
id: 3
title: Urdu Translation Toggle Tasks
stage: tasks
date_iso: 2026-01-04
surface: agent
model: Qwen
feature: urdu-translation-toggle
branch: 004-urdu-translation-toggle
user: user
command: /sp.tasks
labels: ["tasks", "i18n", "docusaurus", "translation"]
links:
  spec: "specs/004-urdu-translation-toggle/spec.md"
  plan: "specs/004-urdu-translation-toggle/plan.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/004-urdu-translation-toggle/tasks.md"
tests_yaml: []
prompt_text: |
  $ARGUMENTS
response_text: |
  Successfully generated the tasks.md file for the Urdu translation toggle feature. The tasks are organized by user story to enable independent implementation and testing. The file includes 6 phases: Setup, Foundational, and 3 user stories (P1, P2, P3) followed by a polish phase. Each task follows the required checklist format with IDs, story labels, and file paths. The tasks are designed to support parallel execution where possible and include dependencies and execution order information.
outcome: |
  Tasks file created with all required phases and user stories. The tasks are organized to support independent implementation and testing of each user story. Ready for implementation phase.
evaluation: |
  The tasks file meets all requirements with proper organization, formatting, and dependencies.
---

# Tasks: Urdu Translation Toggle for Docusaurus Documentation

**Input**: Design documents from `/specs/004-urdu-translation-toggle/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan in physical-ai-books/
- [ ] T002 Initialize Docusaurus v3 project with TypeScript and React dependencies
- [ ] T003 [P] Configure Tailwind CSS for styling in docusaurus.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Configure i18n in Docusaurus to support Urdu locale in docusaurus.config.ts
- [ ] T005 [P] Create Urdu locale directory structure at i18n/ur/docusaurus-plugin-content-docs/
- [ ] T006 [P] Set up basic Urdu translation files for existing documentation
- [ ] T007 Create base LanguageToggle component interface in src/components/LanguageToggle.tsx
- [ ] T008 Configure routing to handle locale-based paths (/docs/... ↔ /ur/docs/...)
- [ ] T009 Setup environment for local development and testing

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access Urdu Documentation (Priority: P1) 🎯 MVP

**Goal**: Enable Urdu-speaking users to switch documentation language to Urdu

**Independent Test**: Can be fully tested by navigating to any documentation page and clicking the language toggle button, which should switch the content to Urdu if available, delivering immediate value to Urdu-speaking users.

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create LanguageToggle component in src/components/LanguageToggle.tsx
- [ ] T011 [P] [US1] Implement language switching logic using Docusaurus i18n APIs
- [ ] T012 [US1] Create theme override for DocItem to inject toggle at page top in src/theme/DocItem/index.tsx
- [ ] T013 [US1] Implement routing logic to switch between English and Urdu content
- [ ] T014 [US1] Add accessibility features to LanguageToggle component
- [ ] T015 [US1] Test language switching functionality on sample documentation page

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Easy Language Switching (Priority: P2)

**Goal**: Ensure language toggle button is visible and accessible at the top of each documentation page

**Independent Test**: Can be tested by verifying that the language toggle button is visible and accessible at the top of each documentation page, providing a consistent user experience.

### Implementation for User Story 2

- [ ] T016 [P] [US2] Style the LanguageToggle component with Tailwind CSS for visibility
- [ ] T017 [US2] Position the toggle at the top of each documentation page via theme override
- [ ] T018 [US2] Add visual indicators to show current language state
- [ ] T019 [US2] Implement keyboard navigation for the language toggle
- [ ] T020 [US2] Test toggle visibility and accessibility on multiple documentation pages

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Maintain Language Preference Per Page (Priority: P3)

**Goal**: Maintain language selection state per page so users can read different chapters in different languages

**Independent Test**: Can be tested by switching languages on one page, navigating to another page, and verifying that each page maintains its own language state independently.

### Implementation for User Story 3

- [ ] T021 [P] [US3] Implement per-page language state management
- [ ] T022 [US3] Create logic to preserve language selection when navigating between pages
- [ ] T023 [US3] Add page identifier to language toggle component props
- [ ] T024 [US3] Implement logic to default to English when visiting new pages
- [ ] T025 [US3] Test per-page language state across multiple documentation pages

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Documentation updates in docs/
- [ ] T027 Code cleanup and refactoring
- [ ] T028 Performance optimization to ensure language switch completes in under 2 seconds
- [ ] T029 [P] Additional unit tests in tests/unit/
- [ ] T030 Security hardening
- [ ] T031 Handle edge case: display English content when Urdu translation is not available
- [ ] T032 Run quickstart.md validation
- [ ] T033 Test browser automation checks pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all implementation tasks for User Story 1 together:
Task: "Create LanguageToggle component in src/components/LanguageToggle.tsx"
Task: "Implement language switching logic using Docusaurus i18n APIs"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence