# Quickstart: Styling & Animation for Docusaurus Book

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Basic knowledge of CSS, Tailwind CSS, and Docusaurus

## Setup Process

### 1. Install Tailwind CSS in Docusaurus

First, install the required dependencies:

```bash
cd physical-ai-books
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

This creates `tailwind.config.js` and `postcss.config.js` files.

### 2. Configure Tailwind

Update `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./docs/**/*.{md,mdx}",
    "./blog/**/*.{md,mdx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff9fb',
          100: '#d6f1f7',
          200: '#ade9f3',
          300: '#76dfeb',
          400: '#3ad4e2',
          500: '#06b6d4', // cyan-500
          600: '#059bb4',
          700: '#04788f',
          800: '#035c70',
          900: '#024557',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // emerald-500
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
};
```

### 3. Configure PostCSS

Ensure `postcss.config.js` includes Tailwind:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 4. Create Custom CSS

Create or update `src/css/custom.css`:

```css
/* Import Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Docusaurus overrides */
html {
  scroll-behavior: smooth;
}

/* Dark theme base styles */
html[data-theme='dark'] {
  --ifm-background-color: #000000;
  --ifm-background-surface-color: #1e293b;
  --ifm-color-content: #f1f5f9;
  --ifm-color-content-secondary: #94a3b8;
}

/* Navbar glassmorphism effect */
.navbar {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Sidebar active item glow */
.menu__list-item-collapsible--active,
.menu__link--active:not(.menu__link--sublist) {
  border-left: 3px solid #06b6d4;
  color: #06b6d4;
}

/* Custom animations */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Code block styling */
.code-block {
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

/* Callout boxes */
.callout-info {
  border-left: 4px solid #06b6d4;
  background-color: rgba(6, 182, 212, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 0.25rem 0.25rem 0;
}

.callout-warning {
  border-left: 4px solid #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 0.25rem 0.25rem 0;
}

.callout-note {
  border-left: 4px solid #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 0.25rem 0.25rem 0;
}
```

### 5. Update Docusaurus Configuration

Update `docusaurus.config.js` to include the custom CSS:

```js
module.exports = {
  // ... other config
  stylesheets: [
    {
      href: '/css/custom.css',
      type: 'text/css',
    },
  ],
  // ... rest of config
};
```

### 6. Create Animation Components

Create a reusable animation component at `src/components/AnimatedComponent.jsx`:

```jsx
import React, { useEffect, useRef } from 'react';

const AnimatedComponent = ({ children, animationClass = 'fade-in', triggerOnLoad = true }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (!triggerOnLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [animationClass, triggerOnLoad]);

  return (
    <div 
      ref={elementRef} 
      className={`opacity-0 ${!triggerOnLoad ? animationClass : ''}`}
    >
      {children}
    </div>
  );
};

export default AnimatedComponent;
```

### 7. Build and Run

```bash
npm run build
npm run start
```

## Key Features Implemented

1. **Dark-first theme** with futuristic color palette
2. **Glassmorphism navbar** with backdrop blur effect
3. **Animated transitions** for page loads and scroll reveals
4. **Accessibility support** with reduced-motion preferences
5. **Responsive design** that works on all device sizes
6. **Custom callout components** for documentation
7. **Performance optimized** CSS animations

## Customization Points

- Update color values in `tailwind.config.js` to adjust the theme
- Modify animation durations in `custom.css` to change timing
- Add new component classes in `custom.css` for additional styling
- Extend the animation component for more complex effects