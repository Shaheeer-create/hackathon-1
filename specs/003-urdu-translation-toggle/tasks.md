# Implementation Tasks: Urdu Translation Toggle for Docusaurus Book

**Feature**: Urdu Translation Toggle for Docusaurus Book  
**Branch**: `003-urdu-translation-toggle`  
**Created**: 2026-01-02  
**Input**: Feature specification from `/specs/003-urdu-translation-toggle/spec.md`

## Implementation Strategy

This implementation follows an incremental delivery approach with the following phases:
1. **Setup**: Initialize project structure and dependencies
2. **Foundation**: Create core components and services
3. **User Stories**: Implement features in priority order (P1, P2, P3)
4. **Polish**: Cross-cutting concerns and final touches

The MVP scope includes User Story 1 (Toggle Chapter Translation) and User Story 2 (Preserve Code Blocks) as these are P1 priorities that deliver core functionality.

## Dependencies

- **User Story 2** (Preserve Code Blocks) is a prerequisite for **User Story 1** (Toggle Chapter Translation)
- **User Story 4** (Preserve Formatting) is a prerequisite for **User Story 1** (Toggle Chapter Translation)

## Parallel Execution Examples

- TranslationService and TranslationUtils can be developed in parallel
- CSS styling can be developed in parallel with component implementation
- Multiple user stories can have their tests developed in parallel

---

## Phase 1: Setup

### Goal
Initialize the project structure and install required dependencies.

### Independent Test Criteria
- Project structure matches the planned architecture
- Dependencies are properly installed
- Development environment is functional

### Tasks

- [X] T001 Create project structure for TranslationToggle component in physical-ai-books/src/components/TranslationToggle/
- [X] T002 Install required dependencies: @google-cloud/translate or similar translation API client
- [X] T003 Set up environment variables for translation API key
- [X] T004 Configure TypeScript settings for the new components

---

## Phase 2: Foundation

### Goal
Create the foundational components and services that will be used across all user stories.

### Independent Test Criteria
- TranslationService can interface with a translation API
- TranslationUtils can extract and preserve content elements
- Components can be integrated with Docusaurus

### Tasks

- [X] T005 [P] Create TranslationService.ts with interface for translation API
- [X] T006 [P] Create TranslationUtils.ts with functions for content extraction and manipulation
- [X] T007 [P] Create TranslationToggle.tsx base component with state management
- [X] T008 [P] Implement extractTranslatableElements function in TranslationUtils.ts
- [X] T009 [P] Implement preserveCodeBlocks function in TranslationUtils.ts
- [X] T010 [P] Implement updateElementText function in TranslationUtils.ts
- [X] T011 [P] Implement generateElementId function in TranslationUtils.ts
- [X] T012 [P] Implement translateText method in TranslationService.ts
- [X] T013 [P] Implement translateMultiple method in TranslationService.ts
- [X] T014 [P] Add basic styling for TranslationToggle component
- [X] T015 [P] Implement caching mechanism with in-memory and localStorage

---

## Phase 3: [US1] Toggle Chapter Translation

### Goal
Implement the core functionality to translate chapter content from English to Urdu with a toggle button.

### Independent Test Criteria
- The feature can be tested by clicking the "Translate to Urdu" button and verifying that the chapter content changes to Urdu while preserving formatting and code blocks.
- The toggle back to English should also work without page reload.

### Tasks

- [X] T016 [US1] Add translation toggle button to TranslationToggle component
- [X] T017 [US1] Implement translation state management (isTranslated, isLoading, error)
- [X] T018 [US1] Implement handleTranslate function to translate content to Urdu
- [X] T019 [US1] Implement handleRevert function to revert to English
- [X] T020 [US1] Integrate TranslationService with TranslationToggle component
- [X] T021 [US1] Add loading states and error handling to the UI
- [ ] T022 [US1] Test translation functionality with sample chapter
- [ ] T023 [US1] Verify toggle works without page reload
- [ ] T024 [US1] Optimize performance to meet 3-second translation requirement

---

## Phase 4: [US2] Preserve Code Blocks

### Goal
Ensure that code blocks remain in English when translating chapters.

### Independent Test Criteria
- After translating a chapter to Urdu, all code blocks should remain in English with their original syntax highlighting and formatting.
- When toggling back to English, code blocks should still be in English.

### Tasks

- [X] T025 [US2] Identify code blocks in chapter content using TranslationUtils
- [X] T026 [US2] Modify translation process to exclude code blocks from translation
- [X] T027 [US2] Verify code blocks retain their original formatting after translation
- [ ] T028 [US2] Test with various types of code blocks (inline, block, with syntax highlighting)
- [ ] T029 [US2] Ensure code blocks remain unchanged when toggling between languages

---

## Phase 5: [US3] Consistent Across All Chapters

### Goal
Ensure the translation feature works consistently across all chapters in the `physical-ai-books` folder.

### Independent Test Criteria
- The translation button should appear and function correctly on every chapter page within the `physical-ai-books` directory.
- When clicking the translation button, the content of that specific chapter should be translated without affecting other chapters.

### Tasks

- [X] T030 [US3] Create a test chapter to validate translation functionality
- [X] T031 [US3] Add TranslationToggle component to multiple chapters
- [X] T032 [US3] Verify per-page state management works correctly
- [X] T033 [US3] Test translation isolation between different chapters
- [X] T034 [US3] Ensure no cross-chapter state contamination
- [X] T035 [US3] Test with chapters of varying complexity and content types

---

## Phase 6: [US4] Preserve Formatting

### Goal
Maintain the same formatting in translated content as in the original.

### Independent Test Criteria
- After translation, headings, subheadings, lists, and tables should maintain their original styling and structure.
- When toggling back to English, all formatting should remain intact.

### Tasks

- [X] T036 [US4] Identify formatting elements (headings, lists, tables) in chapter content
- [X] T037 [US4] Ensure formatting structure is preserved during translation
- [X] T038 [US4] Verify CSS classes and styling remain intact after translation
- [X] T039 [US4] Test with various formatting elements (headings, lists, tables, etc.)
- [X] T040 [US4] Ensure formatting remains consistent when toggling between languages

---

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Address cross-cutting concerns and polish the implementation.

### Independent Test Criteria
- All functional requirements are met
- Performance impact is minimal
- No breaking changes to existing navigation or sidebar structure
- Error handling is robust

### Tasks

- [X] T041 Add error handling for API failures and network issues
- [X] T042 Implement fallback mechanism when translation API is unavailable
- [X] T043 Add performance monitoring to ensure 3-second translation requirement
- [X] T044 Optimize caching to reduce API calls and improve performance
- [X] T045 Test with complex nested formatting and edge cases
- [X] T046 Verify no breaking changes to navigation or sidebar structure
- [X] T047 Add accessibility features to translation toggle UI
- [X] T048 Create documentation for using the TranslationToggle component
- [X] T049 Test with very long chapters to ensure performance
- [X] T050 Add unit tests for TranslationService and TranslationUtils
- [X] T051 Add integration tests for the TranslationToggle component
- [X] T052 Perform end-to-end testing across multiple chapters
- [X] T053 Update docusaurus.config.js if needed to support the new component
- [X] T054 Verify compatibility with Docusaurus v2
- [X] T055 Document environment variables and setup instructions