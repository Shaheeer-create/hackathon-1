# Quickstart: Urdu Translation Toggle for Docusaurus Documentation

## Prerequisites
- Node.js 18+ installed
- Docusaurus 3.x installed
- Basic knowledge of React and TypeScript
- Git for version control

## Setup Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd physical-ai-books
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure i18n in Docusaurus**:
   - Update `docusaurus.config.ts` to include Urdu as a supported locale
   - Set up locale directories in `i18n/ur/`

4. **Create the language toggle component**:
   - Create `src/components/LanguageToggle.tsx`
   - Implement the toggle functionality with proper state management

5. **Override the DocItem theme**:
   - Create `src/theme/DocItem/index.tsx`
   - Inject the language toggle at the top of each documentation page

6. **Add Urdu translations**:
   - Place translated content in `i18n/ur/docusaurus-plugin-content-docs/`
   - Ensure all English documentation has corresponding Urdu translations

7. **Run the development server**:
   ```bash
   npm run start
   ```

## Verification
- Navigate to any documentation page
- Verify the language toggle appears at the top
- Click the toggle and verify language switches correctly
- Check that routing works properly between languages
- Ensure all translated content displays correctly