# Quickstart: Urdu Translation Toggle for Docusaurus Book

## Overview
This guide explains how to implement and use the per-chapter Urdu translation toggle feature in the Physical AI Books Docusaurus site.

## Prerequisites
- Node.js 16+ installed
- Docusaurus v2 project set up
- Access to a translation API (e.g., Google Translate API)

## Installation

### 1. Install Dependencies
```bash
cd physical-ai-books
npm install @google-cloud/translate  # or your preferred translation service
```

### 2. Create Translation Components
Create the following directory structure and files:

```
physical-ai-books/src/components/TranslationToggle/
├── TranslationToggle.tsx
├── TranslationService.ts
└── TranslationUtils.ts
```

### 3. TranslationToggle.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

interface TranslationToggleProps {
  children?: React.ReactNode;
}

const TranslationToggle: React.FC<TranslationToggleProps> = ({ children }) => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const chapterId = location.pathname;

  // Implementation details would go here
  // This component would handle:
  // - Toggle button UI
  // - Translation state management
  // - Content extraction and translation
  // - Preservation of code blocks

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Translation logic would be implemented here
      setIsTranslated(true);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevert = () => {
    setIsTranslated(false);
    setError(null);
  };

  return (
    <div className="translation-toggle-container">
      <div className="translation-controls">
        {!isTranslated ? (
          <button 
            onClick={handleTranslate} 
            disabled={isLoading}
            className="translate-btn"
          >
            {isLoading ? 'Translating...' : '.Translate to Urdu'}
          </button>
        ) : (
          <button 
            onClick={handleRevert}
            className="revert-btn"
          >
            Translate to English
          </button>
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
      {children}
    </div>
  );
};

export default TranslationToggle;
```

### 4. TranslationService.ts
```ts
// Service to handle translation API calls
class TranslationService {
  private static instance: TranslationService;
  private apiKey: string;

  private constructor() {
    // Initialize with API key from environment
    this.apiKey = process.env.TRANSLATION_API_KEY || '';
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  async translateText(text: string, targetLang: string = 'ur'): Promise<string> {
    // Implementation for calling translation API
    // This would use Google Translate, Azure Translator, or similar service
    throw new Error('Translation API call not implemented');
  }

  async translateMultiple(texts: string[], targetLang: string = 'ur'): Promise<string[]> {
    // Batch translation for better performance
    const results = await Promise.all(
      texts.map(text => this.translateText(text, targetLang))
    );
    return results;
  }
}

export default TranslationService;
```

### 5. TranslationUtils.ts
```ts
// Utility functions for content extraction and manipulation
export const extractTranslatableElements = (container: HTMLElement): HTMLElement[] => {
  const selectors = [
    'h1:not(.header), h2:not(.header), h3, h4, h5, h6',
    'p', 
    'li',
    'td',
    'th',
    'div.markdown > :not(pre):not(code):not(img):not(iframe):not(video):not(audio)'
  ];
  
  const elements: HTMLElement[] = [];
  selectors.forEach(selector => {
    const els = Array.from(container.querySelectorAll<HTMLElement>(selector));
    elements.push(...els);
  });
  
  return elements;
};

export const preserveCodeBlocks = (container: HTMLElement): HTMLElement[] => {
  // Find all code blocks to preserve them during translation
  return Array.from(container.querySelectorAll<HTMLElement>('pre, code'));
};

export const updateElementText = (element: HTMLElement, newText: string): void => {
  // Safely update element text while preserving structure
  element.textContent = newText;
};

export const generateElementId = (element: HTMLElement): string => {
  // Generate a unique ID for caching purposes
  return `${element.tagName.toLowerCase()}-${element.textContent?.substring(0, 10).replace(/\W/g, '')}-${Date.now()}`;
};
```

### 6. Register Component in Docusaurus
Update your `docusaurus.config.js` to include the new component:

```js
// docusaurus.config.js
module.exports = {
  // ... other config
  themes: [
    // ... other themes
  ],
  plugins: [
    // ... other plugins
  ],
};
```

### 7. Add Component to MDX Files
Add the translation toggle to each chapter MDX file:

```mdx
import TranslationToggle from '@site/src/components/TranslationToggle';

<TranslationToggle>

# Chapter Title

Your chapter content here...

</TranslationToggle>
```

## Usage

### Adding to New Chapters
For each new chapter in the `physical-ai-books` folder, wrap the content with the TranslationToggle component as shown above.

### Customization
- Modify the styling in your CSS to match your site's design
- Adjust the selectors in `TranslationUtils.ts` to fine-tune which elements get translated
- Configure the translation service with your preferred API

## Environment Variables
Set up your translation API key:

```bash
# In your .env file
TRANSLATION_API_KEY=your_api_key_here
```

## Testing
1. Run the development server: `npm run start`
2. Navigate to a chapter page
3. Verify the "Translate to Urdu" button appears at the top
4. Click the button and verify content translates while preserving code blocks
5. Verify the toggle back to English works