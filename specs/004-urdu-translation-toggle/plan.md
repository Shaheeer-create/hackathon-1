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
