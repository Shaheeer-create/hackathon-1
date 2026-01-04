---
id: 005
title: "Implement Urdu Translation Toggle"
stage: "green"
date: "2026-01-02"
surface: "agent"
model: "Qwen"
feature: "003-urdu-translation-toggle"
branch: "003-urdu-translation-toggle"
user: "user"
command: "sp.implement"
labels: ["implementation", "translation", "docusaurus", "urdu", "react"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "physical-ai-books/src/components/TranslationToggle/TranslationService.ts"
  - "physical-ai-books/src/components/TranslationToggle/TranslationUtils.ts"
  - "physical-ai-books/src/components/TranslationToggle/TranslationToggle.tsx"
  - "physical-ai-books/src/components/TranslationToggle/TranslationToggle.module.css"
  - "physical-ai-books/src/pages/test-translation.mdx"
  - "physical-ai-books/.env"
tests: []
---

## Prompt

```
$ARGUMENTS
```

## Response

Successfully implemented the Urdu Translation Toggle feature with the following components:

1. Created the project structure for TranslationToggle component
2. Installed required dependencies: @google-cloud/translate
3. Set up environment variables for translation API key
4. Created TranslationService.ts with interface for translation API
5. Created TranslationUtils.ts with functions for content extraction and manipulation
6. Created TranslationToggle.tsx base component with state management
7. Added basic styling for TranslationToggle component
8. Implemented caching mechanism with in-memory and localStorage
9. Implemented all user stories (Toggle Chapter Translation, Preserve Code Blocks, Consistent Across All Chapters, Preserve Formatting)
10. Created a test chapter to validate translation functionality
11. Added error handling, performance optimization, and accessibility features

The implementation includes:
- A reusable React component that allows users to translate chapter content from English to Urdu
- Preservation of code blocks in English during translation
- Per-page state management to ensure translation state is isolated per chapter
- Caching mechanism to improve performance and reduce API calls
- Proper error handling and loading states
- Compatibility with Docusaurus v2