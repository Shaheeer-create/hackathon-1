# Feature Specification: Urdu Translation Toggle for Docusaurus Book

**Feature Branch**: `003-urdu-translation-toggle`
**Created**: 2026-01-02
**Status**: Draft
**Input**: User description: "Docusaurus Book Feature: Per-Chapter Urdu Translation Toggle Target audience: Readers of the \"Physical AI Books\" who want to read technical content in either English or Urdu, especially students and practitioners in Pakistan and Urdu-speaking regions. Focus: Enable users to translate the content of each chapter from English to Urdu by pressing a button at the start of that chapter, without leaving the page. Success criteria: - Each chapter page displays a clearly visible \"Translate to Urdu\" button at the top - Button translates only the current chapter\u2019s content (not the entire site) - Translation preserves: - Headings and subheadings - Code blocks (must remain in English, unchanged) - Lists, tables, and formatting - User can toggle back to English without page reload - Works consistently across all chapters in the `physical-ai-books` folder Constraints: - Book is already written in English using Docusaurus (Markdown/MDX) - No duplication of chapters as separate Urdu files - Translation must be dynamic (client-side or API-based) - Performance impact must be minimal - Compatible with Docusaurus v2 - No breaking changes to existing navigation or sidebar structure Technical assumptions: - Chapters are Markdown/MDX files inside `physical-ai-books` - React components can be injected into MDX - Translation can use: - AI translation API (preferred) - OR predefined Urdu translation map if provided later - State management handled per page (not global language switch) Not building: - Full site internationalization (i18n) using Docusaurus locales - Manual Urdu rewriting of chapters - Offline translation support - Translation of UI elements (navbar, footer, sidebar) - Voice or audio translation features Quality validation: - Verify translation accuracy for technical AI terminology - Ensure code blocks are never translated - Test on multiple chapters with different structures - Confirm toggle works without page refresh Output expectation: - A reusable MDX/React component for chapter-level translation - Clear instructions on how to include the button at the start of each chapter - Explanation of how the translation logic works"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Chapter Translation (Priority: P1)

As a reader of the Physical AI Books, I want to translate the current chapter from English to Urdu so that I can better understand technical content in my native language.

**Why this priority**: This is the core functionality that addresses the primary user need of making technical content accessible in Urdu.

**Independent Test**: The feature can be tested by clicking the "Translate to Urdu" button and verifying that the chapter content changes to Urdu while preserving formatting and code blocks. The toggle back to English should also work without page reload.

**Acceptance Scenarios**:

1. **Given** I am viewing a chapter in English, **When** I click the "Translate to Urdu" button, **Then** the chapter content should be displayed in Urdu while preserving headings, lists, tables, and code blocks in their original form
2. **Given** I have translated a chapter to Urdu, **When** I click the "Translate to English" button, **Then** the chapter content should revert to English without page reload

---

### User Story 2 - Preserve Code Blocks (Priority: P1)

As a technical reader, I want code blocks to remain in English when translating chapters so that I can properly understand and implement the code examples.

**Why this priority**: Code blocks are critical for technical understanding and must remain in English to maintain functionality and accuracy.

**Independent Test**: After translating a chapter to Urdu, all code blocks should remain in English with their original syntax highlighting and formatting.

**Acceptance Scenarios**:

1. **Given** a chapter with code blocks in English, **When** I translate the chapter to Urdu, **Then** all code blocks should remain unchanged in English
2. **Given** a chapter translated to Urdu, **When** I toggle back to English, **Then** all code blocks should still be in English

---

### User Story 3 - Consistent Across All Chapters (Priority: P2)

As a reader, I want the translation feature to work consistently across all chapters in the `physical-ai-books` folder so that I can access Urdu translations throughout the entire book.

**Why this priority**: Consistency across all chapters ensures a uniform user experience and complete accessibility of the book content.

**Independent Test**: The translation button should appear and function correctly on every chapter page within the `physical-ai-books` directory.

**Acceptance Scenarios**:

1. **Given** I am on any chapter page in the `physical-ai-books` folder, **When** I navigate to the page, **Then** I should see the translation toggle button at the top
2. **Given** I am on any chapter page, **When** I click the translation button, **Then** the content of that specific chapter should be translated without affecting other chapters

---

### User Story 4 - Preserve Formatting (Priority: P2)

As a reader, I want the translated content to maintain the same formatting as the original so that the reading experience remains consistent and professional.

**Why this priority**: Maintaining formatting ensures readability and preserves the intended structure of the content.

**Independent Test**: After translation, headings, subheadings, lists, and tables should maintain their original styling and structure.

**Acceptance Scenarios**:

1. **Given** a chapter with various formatting elements, **When** I translate to Urdu, **Then** all headings, lists, and tables should maintain their original formatting
2. **Given** a translated chapter, **When** I toggle back to English, **Then** all formatting should remain intact

---

### Edge Cases

- What happens when the translation API is unavailable or slow?
- How does the system handle chapters with complex nested formatting?
- What if a user navigates to another page while translation is in progress?
- How does the system handle very long chapters with extensive content?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a clearly visible "Translate to Urdu" button at the top of each chapter page in the `physical-ai-books` folder
- **FR-002**: System MUST translate only the current chapter's content when the button is clicked, without affecting other pages or site navigation
- **FR-003**: System MUST preserve all code blocks in English during translation, ensuring they remain unchanged and properly formatted
- **FR-004**: System MUST maintain all formatting elements (headings, subheadings, lists, tables) during translation
- **FR-005**: Users MUST be able to toggle back to English without page reload
- **FR-006**: System MUST work consistently across all chapters in the `physical-ai-books` folder
- **FR-007**: System MUST use client-side or API-based dynamic translation without duplicating chapter files
- **FR-008**: System MUST have minimal performance impact on page load and translation operations
- **FR-009**: System MUST be compatible with Docusaurus v2
- **FR-010**: System MUST not introduce breaking changes to existing navigation or sidebar structure
- **FR-011**: System MUST handle translation state management per page, not as a global language switch

### Key Entities

- **Translation Component**: A reusable MDX/React component that handles the translation functionality for individual chapters
- **Chapter Content**: The Markdown/MDX content that needs to be translated while preserving code blocks and formatting
- **Translation State**: Per-page state management that tracks whether the current chapter is in English or Urdu

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can translate any chapter to Urdu within 3 seconds of clicking the translation button
- **SC-002**: 100% of code blocks remain in English and properly formatted after chapter translation
- **SC-003**: All formatting elements (headings, lists, tables) are preserved during translation across 100% of chapters
- **SC-004**: Users can toggle between English and Urdu without page reload in 100% of cases
- **SC-005**: The translation feature works consistently across all chapters in the `physical-ai-books` folder (100% coverage)
- **SC-006**: Performance impact is minimal, with page load times remaining within 10% of original load times
- **SC-007**: No breaking changes are introduced to existing navigation or sidebar structure (100% compatibility maintained)