# Translation API Contract

## Overview
This document defines the API contract for the Urdu translation service used in the Docusaurus book translation toggle feature.

## Translation Service API

### Translate Text
```
POST /api/translate
```

#### Request
```json
{
  "text": "string",
  "targetLanguage": "string",
  "sourceLanguage": "string (optional)"
}
```

#### Response
```json
{
  "translatedText": "string",
  "sourceLanguage": "string",
  "targetLanguage": "string",
  "confidence": "number (0-1)"
}
```

#### Example Request
```json
{
  "text": "This is a sample text to translate",
  "targetLanguage": "ur",
  "sourceLanguage": "en"
}
```

#### Example Response
```json
{
  "translatedText": "یہ ترجمہ کے لئے ایک نمونہ متن ہے",
  "sourceLanguage": "en",
  "targetLanguage": "ur",
  "confidence": 0.95
}
```

### Translate Multiple Texts
```
POST /api/translate-batch
```

#### Request
```json
{
  "texts": ["string"],
  "targetLanguage": "string",
  "sourceLanguage": "string (optional)"
}
```

#### Response
```json
{
  "translatedTexts": ["string"],
  "sourceLanguage": "string",
  "targetLanguage": "string"
}
```

## Client-Side Interface

### TranslationService Interface
```typescript
interface TranslationService {
  translateText(text: string, targetLang?: string): Promise<string>;
  translateMultiple(texts: string[], targetLang?: string): Promise<string[]>;
  isAvailable(): boolean;
}
```

### TranslationToggle Component Props
```typescript
interface TranslationToggleProps {
  children: React.ReactNode;
  targetLanguage?: string; // default: 'ur'
  sourceLanguage?: string; // default: 'en'
  onTranslateStart?: () => void;
  onTranslateComplete?: () => void;
  onTranslateError?: (error: Error) => void;
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad request (invalid input)
- `401`: Unauthorized (invalid API key)
- `403`: Forbidden (quota exceeded)
- `429`: Too many requests (rate limited)
- `500`: Internal server error

### Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

## Performance Requirements
- Response time: < 2 seconds for single text translation
- Batch translation: < 3 seconds for up to 10 texts
- Availability: 99.9% uptime