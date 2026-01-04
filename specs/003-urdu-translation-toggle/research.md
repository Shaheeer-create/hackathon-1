# Research: Urdu Translation Toggle for Docusaurus Book

## Decision: Translation Method
**Rationale**: The feature specification mentions two options for translation: AI Translation API (preferred) or predefined Urdu translation map. Based on the technical assumptions in the spec, AI translation API is preferred. This provides better scalability and maintenance as new content is added.

**Alternatives considered**:
- Predefined translation map: Requires manual translation of all content, not scalable
- AI Translation API: More accurate for technical content, automatically handles new content
- Client-side translation libraries: May not handle technical terminology well

## Decision: Content Extraction Strategy
**Rationale**: To preserve code blocks and formatting while translating text content, we'll use DOM-based parsing to identify translatable elements. This approach allows us to selectively translate text nodes while preserving code blocks, headings, lists, and tables.

**Alternatives considered**:
- AST-based MDX parsing: More complex to implement, requires parsing MDX at build time
- DOM-based parsing: Can be done client-side, allows selective translation of content
- Regex-based extraction: Less reliable for complex HTML structures

## Decision: Caching Strategy
**Rationale**: To improve performance and reduce API calls, we'll implement a dual caching strategy with both in-memory and localStorage caching. This balances performance with persistence across page reloads.

**Alternatives considered**:
- In-memory only: Fast but doesn't persist across page reloads
- localStorage only: Persists but slower than memory access
- Dual caching (in-memory + localStorage): Best of both worlds but slightly more complex

## Decision: Toggle Scope
**Rationale**: The feature specification specifically requests per-chapter translation (not global), which aligns with the requirement that "Button translates only the current chapter's content (not the entire site)". This provides users with granular control over translation.

**Alternatives considered**:
- Per chapter (selected): Matches requirements, allows users to choose per chapter
- Global language switch: Would affect entire site, not what was requested

## Research: Docusaurus MDX Component Integration
**Findings**: Docusaurus v2 supports custom MDX components that can be injected into documentation pages. Components can be registered globally via the theme configuration or added directly to MDX files. This makes it possible to add the translation toggle to chapters either by:
1. Adding the component to each MDX file manually
2. Injecting it automatically via a custom layout or theme wrapper

## Research: Client-Side Translation Best Practices
**Findings**: 
- Translation APIs like Google Translate, Azure Translator, or AWS Translate provide good technical terminology handling
- Client-side translation should include loading states and error handling
- Translation quality for technical content varies; Google Translate generally performs well for technical terminology
- Consider implementing a fallback mechanism if translation API fails

## Research: Urdu Technical Translation Accuracy
**Findings**:
- Google Translate API generally provides good accuracy for technical terms
- For specialized AI/robotics terminology, custom translation mapping might be needed for highest accuracy
- Consider allowing community contributions to improve translation quality over time

## Research: Performance Considerations
**Findings**:
- Translation API calls should be cached to minimize latency
- Large chapters may require chunked translation to stay within API limits
- Consider implementing progressive translation (translate visible content first)
- Loading indicators are important for user experience during translation