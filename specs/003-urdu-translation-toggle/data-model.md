# Data Model: Urdu Translation Toggle for Docusaurus Book

## Entities

### TranslationComponent
- **Description**: Reusable React component that provides the translation toggle functionality
- **Fields**:
  - `chapterId`: string - Unique identifier for the current chapter
  - `isTranslated`: boolean - Current translation state (English=false, Urdu=true)
  - `translationCache`: Map<string, string> - Cache of translated content
  - `isLoading`: boolean - Whether translation is in progress
  - `error`: string | null - Error message if translation fails

### ChapterContent
- **Description**: Represents the content of a chapter that can be translated
- **Fields**:
  - `id`: string - Unique identifier for the chapter
  - `originalContent`: string - The original English content
  - `translatedContent`: string - The translated Urdu content (if available)
  - `translatableElements`: Array<TranslatableElement> - Elements that can be translated
  - `preservedElements`: Array<PreservedElement> - Elements that should not be translated (code blocks, etc.)

### TranslatableElement
- **Description**: An element that can be translated
- **Fields**:
  - `id`: string - Unique identifier for the element
  - `type`: 'heading' | 'paragraph' | 'list-item' | 'table-cell' | 'other' - Type of element
  - `originalText`: string - Original English text
  - `translatedText`: string - Translated Urdu text (if available)
  - `domRef`: HTMLElement | null - Reference to the DOM element

### PreservedElement
- **Description**: An element that should not be translated (e.g., code blocks)
- **Fields**:
  - `id`: string - Unique identifier for the element
  - `type`: 'code-block' | 'formula' | 'image-alt' | 'other' - Type of preserved element
  - `content`: string - Content that should remain unchanged
  - `domRef`: HTMLElement | null - Reference to the DOM element

### TranslationState
- **Description**: Per-page state management for translation
- **Fields**:
  - `currentChapter`: string - ID of the current chapter
  - `translationStatus`: 'original' | 'translated' - Current view status
  - `cacheExpiry`: number - Timestamp when cache expires
  - `lastTranslated`: number | null - Timestamp of last translation

## Relationships

- `TranslationComponent` manages the state of `TranslationState`
- `TranslationComponent` processes `ChapterContent` to translate elements
- `ChapterContent` contains multiple `TranslatableElement` and `PreservedElement` instances
- `TranslationState` tracks the translation status for a specific chapter

## Validation Rules

1. **Code Preservation Rule**: All `PreservedElement` instances must remain unchanged during translation
2. **State Isolation Rule**: Translation state must be isolated per page/chapter
3. **Cache Consistency Rule**: Translated content must match the original structure
4. **Toggle Integrity Rule**: Toggling between languages must restore original content exactly

## State Transitions

### TranslationComponent State Transitions
- `initial` → `idle` (component mounted, no translation)
- `idle` → `translating` (user clicks translate button)
- `translating` → `translated` (translation successful)
- `translating` → `error` (translation failed)
- `translated` → `idle` (user clicks revert button)
- `error` → `idle` (user clicks revert button)
- `error` → `translating` (user retries translation)