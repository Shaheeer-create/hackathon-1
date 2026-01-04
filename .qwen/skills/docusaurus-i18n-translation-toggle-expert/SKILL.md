 name: "docusaurus-i18n-translation-toggle-expert" 
description: "Implement a clean, accessible language translation toggle in Docusaurus using the official i18n system. Use for multilingual docs, locale routing, and RTL support."
version: "1.0.0"
---

# Docusaurus i18n Translation Toggle Skill

## When to Use
- Add multilingual support to Docusaurus
- Create a language toggle / switcher
- Enable Urdu or other RTL languages
- Improve translation UX and routing

## Procedure
1. Configure `i18n` in `docusaurus.config.js`
2. Generate and organize locale files
3. Enable navbar language dropdown
4. Style toggle with CSS / Tailwind
5. Validate routing, accessibility, and RTL

## Output
- **Locales**: Default + supported languages
- **i18n Config**: Minimal setup snippet
- **Folder Structure**: Locale layout
- **Language Toggle UI**: Navbar behavior
- **Styling**: Tailwind/CSS example
- **RTL Notes**: Direction handling

## Quality Criteria
- Page preserved on language switch
- SEO-friendly locale URLs
- Keyboard accessible toggle
- Correct RTL rendering
- No broken links

## Example

**Input**: Add Urdu language toggle

**Output**:
- **Locales**: `en` (default), `ur`
- **Config**:
  ```js
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      ur: { direction: 'rtl' },
    },
  }
````

* **Structure**:

  ```
  i18n/ur/docusaurus-plugin-content-docs/
  ```
* **Styling**:

  ```css
  .navbar__item--localeDropdown {
    @apply transition-colors hover:text-indigo-400;
  }
  ```


