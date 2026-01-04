# Research: Urdu Translation Toggle for Docusaurus Documentation

## Decision: Docusaurus i18n Implementation Approach
**Rationale**: Using Docusaurus built-in i18n functionality is the most appropriate approach as it's officially supported, follows best practices, and integrates well with the existing documentation structure. This approach ensures compatibility with future Docusaurus updates and leverages the framework's routing system.

**Alternatives considered**: 
- Custom translation solution: Would require significant development effort and maintenance
- Third-party translation libraries: Would add complexity and potential compatibility issues
- Manual language switching: Would not integrate well with Docusaurus routing

## Decision: Toggle Placement at Page Level
**Rationale**: Placing the language toggle at the top of each documentation page provides users with immediate access to language switching without having to navigate to a global menu. This meets the requirement of having the toggle visible at the start of each chapter.

**Alternatives considered**:
- Navbar toggle: Less specific to content reading experience
- Sidebar toggle: Might be overlooked by users focused on content
- Footer toggle: Inconvenient for users wanting to switch early in the content

## Decision: Locale-based Routing
**Rationale**: Using Docusaurus's built-in locale routing (`/docs/...` ↔ `/ur/docs/...`) ensures proper SEO, browser history management, and bookmarking capabilities. It also aligns with Docusaurus best practices.

**Alternatives considered**:
- Client-side state management: Would complicate SEO and bookmarking
- Session-based language preference: Would not persist across visits and complicate routing

## Decision: React Component for Toggle
**Rationale**: Creating a custom React component for the language toggle allows for full control over the UI/UX while integrating seamlessly with Docusaurus's theme system. This approach ensures accessibility and responsive design.

**Alternatives considered**:
- Using existing Docusaurus components: Existing components don't meet the specific requirement of per-page toggles
- HTML/CSS only solution: Would lack interactivity and proper state management

## Decision: Tailwind CSS for Styling
**Rationale**: Tailwind CSS provides utility-first styling that integrates well with Docusaurus and allows for rapid development of responsive UI components. It also keeps bundle size manageable.

**Alternatives considered**:
- Plain CSS: Would require more custom code and maintenance
- Styled-components: Would add additional dependencies and complexity
- CSS Modules: Would require additional configuration and setup