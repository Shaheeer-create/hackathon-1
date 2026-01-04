---
name: "docusaurus-homepage-ui-expert"
description: "Design and upgrade the Docusaurus homepage with modern layouts, subtle animations, strong visual hierarchy, and accessible color themes using Tailwind CSS and CSS. Use when improving landing page UX and first impressions."
version: "1.0.0"
---

# Docusaurus Homepage UI Enhancement Skill

## When to Use This Skill

- User wants to **redesign or modernize the Docusaurus homepage**
- User needs a **clean, SaaS-style landing page**
- User asks for **hero section, feature grids, or CTA improvements**
- User wants **animations and motion polish**
- User wants to use **Tailwind CSS with Docusaurus**

## Procedure

1. **Understand homepage intent**
   - Identify target audience (developers, contributors, users)
   - Define primary action (Read docs, Get started, GitHub)

2. **Design page structure**
   - Hero section (value proposition + CTA)
   - Feature highlights (3–6 key benefits)
   - Social proof / credibility (optional)
   - Secondary CTA (Docs, Tutorials)

3. **Apply visual hierarchy**
   - Strong typography scale
   - Clear spacing and section separation
   - Consistent brand colors

4. **Add motion & interaction**
   - Animate hero content on load
   - Hover effects on feature cards
   - Button micro-interactions

5. **Optimize for performance & accessibility**
   - Lazy-load images
   - Respect prefers-reduced-motion
   - Ensure color contrast & keyboard navigation

## Output Format

**Homepage Goal**: Primary conversion objective  
**Layout Structure**: Section-by-section breakdown  
**Color & Typography**: Theme decisions  
**Animation Plan**: Motion strategy  
**Tailwind / CSS Snippets**: Reusable UI patterns  
**CTA Strategy**: Primary + secondary actions  
**Accessibility & Performance Notes**  

## Quality Criteria

- Hero clarity: Message understood in <5 seconds
- Animations: <300ms, non-blocking
- Buttons: Clear hierarchy (primary vs secondary)
- Layout: Mobile-first, responsive
- Performance: No layout shift, minimal JS

## Example

**Input**:  
"Create a modern homepage for my Docusaurus documentation site"

**Output**:

- **Homepage Goal**:
  - Convert visitors into documentation readers
  - Guide users to “Get Started” quickly

- **Layout Structure**:
  1. Hero: Headline, subtext, CTA buttons
  2. Feature Grid: Core benefits of the docs
  3. Workflow Section: How users get value
  4. Call-to-Action: Start reading docs

- **Color & Typography**:
  - Background: `slate-950`
  - Accent: `indigo-500`
  - Text: `slate-100 / slate-400`
  - Headings: bold, tight tracking
  - Body: relaxed leading for readability

- **Animation Plan**:
  - Hero fade + slide-up on load (200ms)
  - Feature cards lift on hover
  - CTA button scale on hover/tap

- **Tailwind Snippet**:
  ```css
  .hero-title {
    @apply text-4xl md:text-6xl font-bold tracking-tight text-slate-100;
  }

  .feature-card {
    @apply bg-slate-900 border border-slate-800 rounded-xl p-6
           transition-all duration-200 ease-out
           hover:-translate-y-1 hover:shadow-lg;
  }

  .primary-cta {
    @apply bg-indigo-500 text-white px-6 py-3 rounded-lg
           transition-transform duration-150 hover:scale-105;
  }
