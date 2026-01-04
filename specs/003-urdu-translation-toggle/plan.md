# Implementation Plan: Urdu Translation Toggle for Docusaurus Book

**Branch**: `003-urdu-translation-toggle` | **Date**: 2026-01-02 | **Spec**: [specs/003-urdu-translation-toggle/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-urdu-translation-toggle/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This plan outlines the implementation of a per-chapter Urdu translation toggle feature for the Physical AI Books Docusaurus site. The solution will provide a reusable React component that allows users to translate chapter content from English to Urdu with a button at the top of each chapter. The implementation will preserve code blocks in English, maintain formatting, and work consistently across all chapters in the `physical-ai-books` folder. The solution uses client-side translation with per-page state management to ensure minimal performance impact and no breaking changes to existing navigation.

## Phase Completion Status

- **Phase 0: Outline & Research** ✅ COMPLETE
  - Research document created: `research.md`
  - All technical unknowns resolved
  - Technology decisions documented

- **Phase 1: Design & Contracts** ✅ COMPLETE
  - Data model created: `data-model.md`
  - API contracts created: `contracts/translation-api.md`
  - Quickstart guide created: `quickstart.md`
  - Agent context updated with new technologies

## Technical Context

**Language/Version**: TypeScript/JavaScript (Docusaurus v2 with React 17+)
**Primary Dependencies**: Docusaurus, React, React DOM, Translation API (e.g., Google Translate API or similar)
**Storage**: In-memory state management with optional localStorage caching
**Testing**: Jest for unit tests, Cypress for end-to-end tests
**Target Platform**: Web (Docusaurus static site, compatible with all modern browsers)
**Project Type**: Web application (Docusaurus-based documentation site)
**Performance Goals**: Translation operation completes within 3 seconds (as per success criteria SC-001)
**Constraints**: Must be compatible with Docusaurus v2, no breaking changes to navigation/sidebar, preserve code blocks in English
**Scale/Scope**: Applied to all chapters in the `physical-ai-books` folder (as per FR-006)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1. **Accuracy**: Translation service must provide accurate technical terminology in Urdu, especially for AI/robotics concepts (Constitution requirement: "All technical claims must be traceable to reliable sources")
   - *Status: PASS* - Will use established translation APIs or verified translation maps

2. **Clarity**: UI must be clear and intuitive for users to toggle between English and Urdu (Constitution requirement: "Content must be written for a Computer Science and software engineering audience")
   - *Status: PASS* - Clear button placement and labeling planned

3. **AI-Native Design**: Translation should not alter embeddings for RAG system (Constitution requirement: "Content optimized for semantic chunking")
   - *Status: PASS* - Translation is client-side only, original content remains unchanged

4. **Personalization**: Feature is available for all users, not personalized (Constitution requirement: "User background and preferences must influence content delivery")
   - *Status: PASS* - Basic feature available to all users

5. **Reproducibility**: Implementation must be well-documented for others to understand and maintain (Constitution requirement: "All processes should be documented with clear steps")
   - *Status: PASS* - Will document component usage and implementation details

6. **Source Integration**: Will use established translation APIs with proper attribution (Constitution requirement: "All content must be properly cited using APA citation style")
   - *Status: PASS* - Will document API usage and any translation sources

7. **Technology Stack Compliance**: Implementation uses React components within Docusaurus (Constitution requirement: "Docs: Docusaurus")
   - *Status: PASS* - Implementation aligns with Docusaurus v2 architecture

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
physical-ai-books/
├── src/
│   ├── components/
│   │   └── TranslationToggle/
│   │       ├── TranslationToggle.tsx
│   │       ├── TranslationService.ts
│   │       └── TranslationUtils.ts
│   ├── pages/
│   └── theme/
│       └── MDXComponents.tsx
├── docusaurus.config.js
├── sidebars.js
└── package.json
```

**Structure Decision**: The feature will be implemented as a reusable React component within the existing Docusaurus project structure. The TranslationToggle component will be placed in the physical-ai-books directory where the Docusaurus documentation is located. This follows the web application structure since Docusaurus is a static site generator that creates web applications.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations identified that require justification. All implementation approaches align with the project constitution.
