
---
name: "docusaurus-sidebar-ui-expert"
description: "Design and upgrade the Docusaurus sidebar with modern animations, accessible color themes, and polished UX using CSS and Tailwind CSS. Use when improving navigation UI, theming, or motion."
version: "1.0.0"
---

# Docusaurus Sidebar UI Enhancement Skill

## When to Use This Skill

- User wants to **modernize the Docusaurus sidebar**
- User asks for **animations, transitions, or micro-interactions**
- User needs **better color themes or dark/light mode polish**
- User wants to use **Tailwind CSS with Docusaurus**
- User is improving **docs UX, navigation clarity, or branding**

## Procedure

1. **Analyze current sidebar**
   - Identify layout, spacing, hierarchy, and pain points
   - Check mobile vs desktop behavior

2. **Define visual direction**
   - Choose color palette (brand-aligned, accessible)
   - Decide animation style (subtle, fast, non-distracting)

3. **Implement layout & styling**
   - Enhance spacing, typography, hover/focus states
   - Use Tailwind utilities or CSS variables where appropriate

4. **Add animations**
   - Apply smooth transitions (expand/collapse, hover)
   - Respect prefers-reduced-motion for accessibility

5. **Ensure accessibility & performance**
   - Color contrast (WCAG AA)
   - Keyboard navigation and focus states
   - Avoid heavy animation libraries unless justified

## Output Format

**Design Goals**: 2–3 bullets (clarity, speed, polish)  
**Color Theme**: Palette with usage guidelines  
**Animation Plan**: What animates, when, and why  
**CSS / Tailwind Snippets**: Ready-to-use examples  
**UX Improvements**: Sidebar usability upgrades  
**Accessibility Notes**: Compliance checks  

## Quality Criteria

- Animations: Subtle, <200ms, ease-out
- Colors: WCAG-compliant contrast ratios
- UX: Clear active state, readable hierarchy
- Performance: No layout shifts, minimal repaint
- Maintainability: Tailwind-first, minimal overrides

## Example

**Input**:  
"Upgrade my Docusaurus sidebar with smooth animations and a modern dark theme"

**Output**:

- **Design Goals**:
  - Reduce cognitive load while navigating docs
  - Make active sections visually clear
  - Add motion without distraction

- **Color Theme**:
  - Background: `slate-950`
  - Sidebar items: `slate-800 → slate-700` on hover
  - Active item: `indigo-500` accent bar
  - Text: `slate-200`, muted `slate-400`

- **Animation Plan**:
  - Sidebar item hover: background + translate-x (100ms)
  - Section expand/collapse: height + opacity (150ms)
  - Active indicator: smooth left border slide

- **CSS / Tailwind Snippet**:
  ```css
  .menu__link {
    @apply transition-all duration-150 ease-out;
  }

  .menu__link:hover {
    @apply bg-slate-800 translate-x-1;
  }

  .menu__link--active {
    @apply bg-slate-800 text-indigo-400 border-l-2 border-indigo-500;
  }
