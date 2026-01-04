---
id: 003
title: "Plan Urdu Translation Toggle"
stage: "plan"
date: "2026-01-02"
surface: "agent"
model: "Qwen"
feature: "003-urdu-translation-toggle"
branch: "003-urdu-translation-toggle"
user: "user"
command: "sp.plan"
labels: ["planning", "translation", "docusaurus", "urdu", "react"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "specs/003-urdu-translation-toggle/plan.md"
  - "specs/003-urdu-translation-toggle/research.md"
  - "specs/003-urdu-translation-toggle/data-model.md"
  - "specs/003-urdu-translation-toggle/quickstart.md"
  - "specs/003-urdu-translation-toggle/contracts/translation-api.md"
tests: []
---

## Prompt

```
/sp.plan Per-Chapter Urdu Translation Toggle for Docusaurus Book

## Create

### Architecture Sketch
- **UI Layer (MDX)**
  - Reusable `<ChapterTranslateToggle />` React component injected at top of each chapter.
- **Translation Layer**
  - Client-side translation service wrapper (AI API or pluggable provider).
  - Content parser to extract translatable nodes (exclude code blocks).
- **State Layer**
  - Per-page state (English ↔ Urdu toggle).
  - Cached translations (in-memory + optional localStorage).
- **Docusaurus Integration**
  - MDX component registration.
  - Scoped to `physical-ai-books` folder only.

### Section Structure
1. Overview & Goals
2. Docusaurus + MDX Integration
3. Translation Flow (Content → Filter → Translate → Render)
4. UI/UX Behavior (button, toggle, loading states)
5. Performance & Caching
6. Edge Cases (tables, math, code)
7. Validation & Testing

### Research Approach
- Concurrent research while building:
  - Docusaurus v2 MDX component patterns
  - Best practices for client-side translation
  - Urdu technical translation accuracy for AI terms
- Validate assumptions early with a single pilot chapter.

### Quality Validation
- Accuracy review for technical terminology
- Formatting parity check (before vs after translation)
- UX validation: toggle speed and clarity

---

## Decisions Needing Documentation

1. **Translation Method**
   - Options:
     - AI Translation API (high accuracy, cost)
     - Predefined translation map (low cost, manual)
   - Tradeoff: Accuracy vs cost and latency

2. **Content Extraction Strategy**
   - Options:
     - DOM-based parsing
     - AST-based MDX parsing
   - Tradeoff: Simplicity vs robustness

3. **Caching Strategy**
   - Options:
     - In-memory only
     - localStorage + memory
   - Tradeoff: Performance vs storage complexity

4. **Toggle Scope**
   - Options:
     - Per chapter (chosen)
     - Global language switch
   - Tradeoff: Simplicity vs full i18n coverage

---

## Testing Strategy

### Validation Checks (Acceptance Criteria Based)
- Button visible at top of every chapter in `physical-ai-books`
- Toggle translates only chapter content
- Code blocks remain unchanged
- Headings, lists, and tables preserved
- Toggle back to English works without reload
- No sidebar or navigation breakage

### Test Types
- Manual UI testing on 3–5 chapters
- Edge-case testing (long chapters, heavy code)
- Performance check (translation time < acceptable threshold)

---

## Technical Details

- **Development Approach:** Research-concurrent (iterate while validating assumptions)
- **Citation Style:** APA (as per Constitution requirement)
- **Phased Execution:**
  1. **Research**
     - Docusaurus MDX hooks, translation APIs
  2. **Foundation**
     - Build toggle component, content filtering
  3. **Analysis**
     - Test accuracy, performance, UX
  4. **Synthesis**
     - Finalize reusable component + documentation
```

## Response

Successfully completed the implementation planning for the Urdu Translation Toggle feature. The following artifacts were created:

1. **plan.md** - The main implementation plan with technical context, constitution check, and project structure
2. **research.md** - Research findings on translation methods, content extraction, caching strategies, and best practices
3. **data-model.md** - Data model defining entities like TranslationComponent, ChapterContent, TranslatableElement, etc.
4. **quickstart.md** - Quickstart guide with installation instructions and usage examples
5. **contracts/translation-api.md** - API contract for the translation service

The plan includes:
- TypeScript/JavaScript implementation using Docusaurus and React
- Client-side translation with per-page state management
- Preservation of code blocks during translation
- Integration with the existing Docusaurus v2 setup
- Compliance with project constitution requirements

Phase 0 (Research) and Phase 1 (Design & Contracts) are complete. The agent context was updated with the new technology information.