---
id: 001
title: "Create Urdu Translation Spec"
stage: "spec"
date: "2026-01-02"
surface: "agent"
model: "Qwen"
feature: "003-urdu-translation-toggle"
branch: "003-urdu-translation-toggle"
user: "user"
command: "sp.specify"
labels: ["specification", "translation", "docusaurus", "urdu"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "specs/003-urdu-translation-toggle/spec.md"
  - "specs/003-urdu-translation-toggle/checklists/requirements.md"
tests: []
---

## Prompt

```
Docusaurus Book Feature: Per-Chapter Urdu Translation Toggle Target audience: Readers of the "Physical AI Books" who want to read technical content in either English or Urdu, especially students and practitioners in Pakistan and Urdu-speaking regions. Focus: Enable users to translate the content of each chapter from English to Urdu by pressing a button at the start of that chapter, without leaving the page. Success criteria: - Each chapter page displays a clearly visible "Translate to Urdu" button at the top - Button translates only the current chapter's content (not the entire site) - Translation preserves: - Headings and subheadings - Code blocks (must remain in English, unchanged) - Lists, tables, and formatting - User can toggle back to English without page reload - Works consistently across all chapters in the `physical-ai-books` folder Constraints: - Book is already written in English using Docusaurus (Markdown/MDX) - No duplication of chapters as separate Urdu files - Translation must be dynamic (client-side or API-based) - Performance impact must be minimal - Compatible with Docusaurus v2 - No breaking changes to existing navigation or sidebar structure Technical assumptions: - Chapters are Markdown/MDX files inside `physical-ai-books` - React components can be injected into MDX - Translation can use: - AI translation API (preferred) - OR predefined Urdu translation map if provided later - State management handled per page (not global language switch) Not building: - Full site internationalization (i18n) using Docusaurus locales - Manual Urdu rewriting of chapters - Offline translation support - Translation of UI elements (navbar, footer, sidebar) - Voice or audio translation features Quality validation: - Verify translation accuracy for technical AI terminology - Ensure code blocks are never translated - Test on multiple chapters with different structures - Confirm toggle works without page refresh Output expectation: - A reusable MDX/React component for chapter-level translation - Clear instructions on how to include the button at the start of each chapter - Explanation of how the translation logic works
```

## Response

Successfully created the feature specification for the Urdu Translation Toggle feature. The specification includes:

1. Created a new branch named `003-urdu-translation-toggle`
2. Created the spec directory `specs/003-urdu-translation-toggle/`
3. Created the specification file `spec.md` with detailed requirements based on the feature description
4. Created the history/prompts directory for this feature
5. Created a validation checklist to ensure specification quality

The specification includes:
- Multiple prioritized user stories covering the core functionality
- Detailed functional requirements (FR-001 through FR-011)
- Success criteria with measurable outcomes (SC-001 through SC-007)
- Edge cases to consider
- Key entities involved in the feature

The specification addresses all the requirements from the original feature description, focusing on enabling per-chapter Urdu translation in the Docusaurus-based Physical AI Books while preserving code blocks and formatting, with minimal performance impact.