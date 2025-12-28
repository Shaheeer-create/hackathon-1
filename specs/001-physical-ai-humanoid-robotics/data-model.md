# Design Elements: Styling & Animation for Docusaurus Book

## Color System

### Primary Colors
- **Background**: `#000000` (black) - Main background for dark theme
- **Surface**: `#1e293b` (slate-800 equivalent) - Content backgrounds
- **Text Primary**: `#f1f5f9` (slate-100) - Main text color
- **Text Secondary**: `#94a3b8` (slate-400) - Secondary text

### Accent Colors
- **Primary Accent**: `#06b6d4` (cyan-500) - Links, highlights
- **Secondary Accent**: `#10b981` (emerald-500) - Success states, highlights
- **Warning**: `#f59e0b` (amber-500) - Warning states
- **Error**: `#ef4444` (red-500) - Error states

## Typography System

### Font Stack
- **Primary**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **Code**: `ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

### Hierarchy
- **h1**: 2.5rem (40px), bold, leading-tight
- **h2**: 2rem (32px), semibold, leading-snug
- **h3**: 1.5rem (24px), semibold, leading-normal
- **h4**: 1.25rem (20px), semibold, leading-normal
- **Body**: 1rem (16px), normal, leading-relaxed
- **Small**: 0.875rem (14px), normal, leading-relaxed

## Spacing System
- **Base unit**: 0.25rem (4px)
- **Scale**: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64

## Animation System

### Duration Scale
- **Instant**: 100ms - Micro-interactions
- **Quick**: 200ms - Hover states
- **Standard**: 300ms - Component transitions
- **Slow**: 400ms - Page transitions

### Easing Functions
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` - General transitions
- **Emphasized**: `cubic-bezier(0.2, 0.8, 0.2, 1)` - More expressive motion
- **Decelerated**: `cubic-bezier(0, 0, 0.2, 1)` - Starting motion
- **Accelerated**: `cubic-bezier(0.4, 0, 1, 1)` - Ending motion

### Animation Properties
- **Preferred**: `transform`, `opacity` - Hardware accelerated
- **Avoid**: `width`, `height`, `top`, `left` - Cause layout reflow

## Component Styling Specifications

### Navbar
- **Height**: 4rem (64px)
- **Background**: `rgba(0, 0, 0, 0.8)` with backdrop-filter for glass effect
- **Padding**: 1rem horizontal
- **Shadow**: Subtle bottom shadow for depth

### Sidebar
- **Width**: 280px on desktop, full screen on mobile
- **Background**: `#0f172a` (slate-900)
- **Active Item**: Left border in primary accent color
- **Hover Effect**: Background color change with transition

### Content Area
- **Max Width**: 800px for optimal reading
- **Padding**: 2rem on desktop, 1rem on mobile
- **Line Height**: 1.7 for body text
- **Code Blocks**: Dark background with syntax highlighting

### Callout Components
- **Info**: Left border in cyan, background slight tint
- **Warning**: Left border in amber, background slight tint
- **Note**: Left border in emerald, background slight tint
- **Padding**: 1rem
- **Border Radius**: 0.25rem

## Responsive Breakpoints
- **Mobile**: 0px to 768px
- **Tablet**: 768px to 1024px
- **Desktop**: 1024px and above

## Accessibility Features
- **Focus Indicators**: 2px solid primary accent color with 2px offset
- **Reduced Motion**: Disable all non-essential animations when `prefers-reduced-motion` is set
- **Contrast Ratios**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Interactive Elements**: Minimum 44px touch target size