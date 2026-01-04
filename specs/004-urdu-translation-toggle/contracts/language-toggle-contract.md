# Component Contract: Language Toggle

## LanguageToggle Component

### Interface
```typescript
interface LanguageToggleProps {
  /**
   * Current language displayed on the page
   */
  currentLanguage: 'en' | 'ur';
  
  /**
   * Available languages for the toggle
   */
  availableLanguages: Array<'en' | 'ur'>;
  
  /**
   * Callback function when language is switched
   */
  onLanguageChange: (newLanguage: 'en' | 'ur') => void;
  
  /**
   * Optional page identifier for tracking
   */
  pageId?: string;
}

interface LanguageToggleState {
  /**
   * The currently selected language
   */
  selectedLanguage: 'en' | 'ur';
  
  /**
   * Whether the toggle is in a loading state
   */
  isLoading: boolean;
  
  /**
   * Error state if language switching fails
   */
  error: string | null;
}
```

### Behavior
- The component should display the current language
- When clicked, it should switch between available languages
- It should handle loading states during language switching
- It should display error messages if language switching fails
- It should maintain accessibility standards (keyboard navigation, screen reader support)

### Expected Response Time
- Language switch should complete within 2 seconds
- Component should render immediately without blocking content

### Error Handling
- If requested language is not available, display error message
- If translation file fails to load, fallback to default language
- Log errors for debugging purposes