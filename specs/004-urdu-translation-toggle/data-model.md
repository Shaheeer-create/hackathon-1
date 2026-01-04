# Data Model: Urdu Translation Toggle for Docusaurus Documentation

## Entities

### Language Toggle Component
- **Name**: LanguageToggle
- **Fields**:
  - currentLanguage: string (en | ur)
  - availableLanguages: array of strings
  - pageId: string (identifier for the current page)
- **Relationships**: 
  - Associated with a specific documentation page
  - Connected to locale routing system
- **Validation rules**: 
  - currentLanguage must be one of the available languages
  - pageId must correspond to an existing documentation page

### Translation Files
- **Name**: TranslationFile
- **Fields**:
  - locale: string (en | ur)
  - filePath: string (path to the translated content)
  - contentHash: string (to verify content integrity)
- **Relationships**:
  - Maps to corresponding English content
  - Organized by documentation section/page
- **Validation rules**:
  - filePath must exist in the appropriate locale directory
  - Content must match the structure of the source language

### Page State
- **Name**: PageLanguageState
- **Fields**:
  - pageId: string (identifier for the page)
  - selectedLanguage: string (en | ur)
  - timestamp: datetime (when the language was selected)
- **Relationships**:
  - Associated with a specific user session (if tracking is implemented)
  - Connected to the documentation page
- **Validation rules**:
  - selectedLanguage must be one of the supported languages
  - pageId must be valid and exist in the documentation