---
id: 1
title: Create Urdu Translation Spec
stage: spec
date_iso: 2026-01-04
surface: agent
model: Qwen
feature: urdu-translation-toggle
branch: 004-urdu-translation-toggle
user: user
command: /sp.specify
labels: ["specification", "i18n", "docusaurus", "translation"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/004-urdu-translation-toggle/spec.md"
  - "specs/004-urdu-translation-toggle/checklists/requirements.md"
tests_yaml: []
prompt_text: |
  $ARGUMENTS
  Title: Chapter-level Urdu Translation Toggle for Docusaurus Documentation Goal: Enable users to translate chapter content into Urdu by pressing a button at the start of each chapter using Docusaurus i18n. Target audience: - Documentation users (Urdu + English readers) - Maintainers of Docusaurus-based docs Success criteria: - Each chapter displays a visible language toggle button at the top - Clicking the button switches content between English and Urdu - Uses official Docusaurus i18n method (no custom translation hacks) - Urdu translations load correctly from locale files - Feature works in local development and passes browser automation checks Constraints: - Framework: Docusaurus v3 - Translation method: Built-in i18n - Languages: `en` (default), `ur` - Format: Markdown docs - No external translation APIs at runtime Technical Context: - Project folder: `physical-ai-books/` - Docs path: `physical-ai-books/docs/` - i18n path: `physical-ai-books/i18n/` - Urdu locale folder: `physical-ai-books/i18n/ur/` - Sidebar config: `physical-ai-books/sidebars.ts` - Toggle placement: Top of each doc page (chapter start) - Toggle scope: Per-page language switch (via route/locale) Agent Capabilities Required: - Docusaurus i18n translation toggle expert - Deep understanding of locale routing and navbar/page-level toggles - Custom React component integration in Docusaurus - Tailwind CSS + minimal custom CSS for toggle UI - Accessibility-aware UX design for language switching Knowledge & Reference Policy: - Use Context7 MCP for: - Verified Docusaurus i18n patterns - Translation file structure and routing behavior - Best practices for language toggles in documentation UX - Avoid undocumented or experimental Docusaurus APIs Testing & Validation Tools: - Local development server (`npm run start`) - Playwright MCP to: - Launch local site - Navigate to multiple chapters - Verify toggle visibility - Assert correct language switch (EN ↔ UR) - Confirm no broken routes or missing content Not building: - Automatic machine translation - Full site-wide language switch redesign - RTL layout overhaul beyond Urdu text rendering - Production deployment pipeline
response_text: |
  Successfully created feature specification for Urdu translation toggle. Created branch 004-urdu-translation-toggle, spec file at specs/004-urdu-translation-toggle/spec.md, and checklist at specs/004-urdu-translation-toggle/checklists/requirements.md. The specification includes user stories, functional requirements, success criteria, and has been validated against quality criteria with all items marked as completed.
outcome: |
  Specification created and validated successfully. Ready for planning phase.
evaluation: |
  The specification meets all quality criteria and is ready for the next phase.
---

# Feature Specification: Chapter-level Urdu Translation Toggle for Docusaurus Documentation

**Feature Branch**: `004-urdu-translation-toggle`
**Created**: 2026-01-04
**Status**: Draft
**Input**: User description: "Enable users to translate chapter content into Urdu by pressing a button at the start of each chapter. Target audience: - Documentation users (Urdu + English readers) - Maintainers of Docusaurus-based docs Success criteria: - Each chapter displays a visible language toggle button at the top - Clicking the button switches content between English and Urdu - Uses official Docusaurus i18n method (no custom translation hacks) - Urdu translations load correctly from locale files - Feature works in local development and passes browser automation checks"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Urdu Documentation (Priority: P1)

As a Urdu-speaking user, I want to be able to switch the documentation language to Urdu so that I can understand the content better.

**Why this priority**: This is the core functionality that enables Urdu-speaking users to access the documentation content, which is the primary goal of this feature.

**Independent Test**: Can be fully tested by navigating to any documentation page and clicking the language toggle button, which should switch the content to Urdu if available, delivering immediate value to Urdu-speaking users.

**Acceptance Scenarios**:

1. **Given** I am on any documentation page with English content, **When** I click the Urdu language toggle button, **Then** the page content switches to Urdu if translations are available
2. **Given** I am on a documentation page with Urdu content, **When** I click the English language toggle button, **Then** the page content switches back to English

---

### User Story 2 - Easy Language Switching (Priority: P2)

As a documentation user, I want to see a visible language toggle button at the top of each chapter so that I can easily switch between languages without searching for it.

**Why this priority**: This enhances the user experience by making the language switching functionality easily discoverable and accessible.

**Independent Test**: Can be tested by verifying that the language toggle button is visible and accessible at the top of each documentation page, providing a consistent user experience.

**Acceptance Scenarios**:

1. **Given** I am on any documentation page, **When** I view the page, **Then** I can see a language toggle button at the top of the content area
2. **Given** I am on a documentation page, **When** I click the language toggle button, **Then** the language switches and the button reflects the current language state

---

### User Story 3 - Maintain Language Preference Per Page (Priority: P3)

As a documentation user, I want the language selection to be maintained per page so that I can read different chapters in different languages if needed.

**Why this priority**: This provides flexibility for users who might want to read some chapters in English and others in Urdu, depending on their comfort level with each language for specific topics.

**Independent Test**: Can be tested by switching languages on one page, navigating to another page, and verifying that each page maintains its own language state independently.

**Acceptance Scenarios**:

1. **Given** I have switched to Urdu on one documentation page, **When** I navigate to another documentation page, **Then** that page defaults to English (or user's system preference)
2. **Given** I am on a documentation page in Urdu, **When** I navigate to another page and switch to English, **Then** the current page displays in English while the previous page remains in Urdu

---

### Edge Cases

- What happens when a specific chapter doesn't have an Urdu translation available?
- How does the system handle switching languages when the user has scrolled down the page?
- What happens when the user refreshes the page after switching languages?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a language toggle button at the top of each documentation page
- **FR-002**: System MUST allow users to switch between English and Urdu content by clicking the toggle button
- **FR-003**: System MUST use built-in i18n functionality to handle language switching
- **FR-004**: System MUST load Urdu translations from locale files
- **FR-005**: System MUST maintain per-page language selection state
- **FR-006**: System MUST display English content when Urdu translation is not available for a specific page
- **FR-007**: System MUST ensure the toggle UI is accessible to users with disabilities
- **FR-008**: System MUST work correctly in local development environment
- **FR-009**: System MUST pass browser automation checks

### Key Entities

- **Language Toggle Component**: A UI element that allows users to switch between English and Urdu content
- **Translation Files**: Locale files containing the Urdu translations for documentation content
- **Page State**: The current language state for each individual documentation page

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch between English and Urdu content on any documentation page in under 2 seconds
- **SC-002**: 100% of documentation pages display the language toggle button at the top of the content area
- **SC-003**: 95% of users successfully switch languages on their first attempt without requiring instructions
- **SC-004**: Pages load with correct language content based on user selection without requiring page refresh