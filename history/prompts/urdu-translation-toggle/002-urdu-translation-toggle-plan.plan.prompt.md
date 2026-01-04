---
id: 2
title: Urdu Translation Toggle Plan
stage: plan
date_iso: 2026-01-04
surface: agent
model: Qwen
feature: urdu-translation-toggle
branch: 004-urdu-translation-toggle
user: user
command: /sp.plan
labels: ["planning", "i18n", "docusaurus", "translation"]
links:
  spec: "specs/004-urdu-translation-toggle/spec.md"
  ticket: null
  adr: null
  pr: null
files_yaml:
  - "specs/004-urdu-translation-toggle/plan.md"
  - "specs/004-urdu-translation-toggle/research.md"
  - "specs/004-urdu-translation-toggle/data-model.md"
  - "specs/004-urdu-translation-toggle/quickstart.md"
  - "specs/004-urdu-translation-toggle/contracts/language-toggle-contract.md"
tests_yaml: []
prompt_text: |
  $ARGUMENTS
  /sp.plan
  Create:
  Architecture sketch:
  - Docusaurus v3 with built-in i18n (`en`, `ur`)
  - Locale-based routing (`/docs/...` ↔ `/ur/docs/...`)
  - Custom React language-toggle component
  - Toggle injected at top of each doc page via theme component override
  - Styling via Tailwind CSS + minimal custom CSS
  - Content sourced from `i18n/ur/docusaurus-plugin-content-docs/`
  Section structure:
  - Base docs: `docs/`
  - Urdu translations: `i18n/ur/docusaurus-plugin-content-docs/`
  - Shared UI components: `src/components/`
  - Theme overrides: `src/theme/DocItem/`
  - Config: `docusaurus.config.ts`, `sidebars.ts`
  Research approach:
  - Research-concurrent workflow:
    - Validate i18n patterns via Context7 MCP while implementing
    - Reference official Docusaurus routing and locale behavior
    - Cross-check UX placement best practices for per-page toggles
  Quality validation:
  - Toggle visible at start of every chapter
  - Correct locale routing on toggle click
  - No content mismatch between EN and UR versions
  - No console errors or broken links
  - Toggle does not affect unrelated pages
  Decisions needing documentation:
  - Toggle location (navbar vs per-page)
    - Tradeoff: Global visibility vs chapter-specific clarity
  - Locale switching method (route-based vs state-based)
    - Tradeoff: SEO + reload vs client-side smoothness
  - Styling approach (Tailwind vs plain CSS)
    - Tradeoff: Speed vs bundle size
  Testing strategy:
  - Local dev server validation
  - Playwright MCP checks:
    - Launch local site
    - Navigate to multiple chapters
    - Assert toggle presence
    - Switch EN ↔ UR and verify content
    - Ensure no 404s or route mismatches
  Phases:
  - Research: Context7 MCP validation of i18n + toggle patterns
  - Foundation: Configure i18n, folder structure, base translations
  - Analysis: Implement toggle component and theme overrides
  - Synthesis: UX polish, regression testing, documentation
response_text: |
  Successfully created the implementation plan for the Urdu translation toggle feature. Created plan.md with technical context, project structure, and constitution check. Also generated research.md, data-model.md, quickstart.md, and language-toggle-contract.md. Updated agent context with new technology information. All Phase 0 and Phase 1 planning artifacts completed.
outcome: |
  Implementation plan created with all required artifacts. The plan includes technical context, project structure, research findings, data model, quickstart guide, and component contracts. Agent context has been updated with new technology information. Ready for task breakdown phase.
evaluation: |
  The implementation plan meets all requirements and includes all necessary components for the next phase of development.
---

# Implementation Plan: Urdu Translation Toggle for Docusaurus Documentation

**Branch**: `004-urdu-translation-toggle` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-urdu-translation-toggle/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enable users to translate chapter content into Urdu by pressing a button at the start of each chapter using Docusaurus i18n. The solution involves implementing a custom language toggle component that integrates with Docusaurus's built-in i18n functionality, allowing users to switch between English and Urdu content per page. The toggle will be placed at the top of each documentation page, with content sourced from locale files.

## Technical Context

**Language/Version**: TypeScript, Docusaurus v3
**Primary Dependencies**: Docusaurus core packages, React, Tailwind CSS
**Storage**: File-based (locale files in i18n/ur/docusaurus-plugin-content-docs/)
**Testing**: Jest, Playwright for browser automation
**Target Platform**: Web (Docusaurus documentation site)
**Project Type**: Web documentation site
**Performance Goals**: Language switch completes in under 2 seconds, toggle visible immediately
**Constraints**: Must use official Docusaurus i18n method, no custom translation hacks, per-page language selection
**Scale/Scope**: Documentation pages with Urdu translations available

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Accuracy**: Using official Docusaurus i18n functionality ensures no hallucinated APIs
- **Clarity**: Component interfaces clearly defined with TypeScript
- **AI-Native Design**: Architecture supports semantic chunking for RAG system
- **Personalization**: Feature supports user language preferences
- **Reproducibility**: Implementation follows documented Docusaurus patterns
- **Source Integration**: Following official Docusaurus documentation for i18n

## Project Structure

### Documentation (this feature)

```text
specs/004-urdu-translation-toggle/
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
├── docs/                                    # Base documentation files
├── i18n/
│   └── ur/                                  # Urdu translations
│       └── docusaurus-plugin-content-docs/  # Urdu documentation content
├── src/
│   ├── components/                          # Shared UI components
│   │   └── LanguageToggle.tsx               # Language toggle component
│   └── theme/
│       └── DocItem/                         # Theme overrides for documentation pages
│           └── index.tsx                    # Inject toggle at top of each doc page
├── docusaurus.config.ts                     # Docusaurus configuration with i18n
└── sidebars.ts                              # Sidebar configuration
```

**Structure Decision**: Web application structure selected as this is a Docusaurus documentation site with frontend components. The language toggle component is placed in src/components/ and integrated via theme override at src/theme/DocItem/ to ensure it appears at the top of each documentation page.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [N/A] | [N/A] | [N/A] |