# Quick Reference: Modern UI Implementation

## Color Constants (Copy-Paste Ready)

```css
/* Primary */
--primary: #4f46e5;      /* Indigo - buttons, links */
--primary-dark: #4338ca; /* Hover state */

/* Semantics */
--success: #22c55e;      /* Green - success, completed */
--error: #dc2626;        /* Red - errors, warnings */
--warning: #fecaca;      /* Light red - alerts */

/* Neutrals */
--text-dark: #0f172a;    /* Headings */
--text-body: #1e293b;    /* Body text */
--text-muted: #64748b;   /* Secondary */
--text-hint: #94a3b8;    /* Placeholders */

/* Greys */
--bg-light: #f5f7fa;     /* Page background */
--bg-card: #f8fafc;      /* Card background */
--border: #e2e8f0;       /* Borders */
--bg-hover: #f8f7ff;     /* Hover state */
--bg-error: #fef2f2;     /* Error background */
```

## Common Patterns

### Button Styling
```css
/* Primary Button */
button {
  background: #4f46e5;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
}

button:hover {
  background: #4338ca;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  transform: translateY(-1px);
}

button:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}
```

### Input Styling
```css
/* Form Input */
input, select {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

input.error {
  border-color: #ef4444;
  background-color: #fef2f2;
}
```

### Card / Option Styling
```css
/* Radio/Select Cards */
.option {
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.option:hover {
  border-color: #4f46e5;
  background: #f8f7ff;
}

.option.selected {
  border-color: #4f46e5;
  background: #f8f7ff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Responsive Breakpoints

```css
/* Desktop (default) */
body { padding: 20px; }
.container { max-width: 700px; }
.content { padding: 40px; }

/* Tablet */
@media (max-width: 768px) {
  .container { max-width: 90%; }
  .content { padding: 24px; }
  .grid { grid-template-columns: 1fr; }
}

/* Mobile */
@media (max-width: 480px) {
  body { padding: 12px; }
  .content { padding: 20px; }
  .progress-bar { display: none; }
  button { width: 100%; }
}
```

## Shadow System

```css
/* Subtle (inputs, small elements) */
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

/* Light (hover states) */
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);

/* Medium (cards on hover) */
box-shadow: 0 4px 12px rgba(79, 70, 229, 0.12);

/* Container (main card) */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07),
            0 10px 20px rgba(0, 0, 0, 0.05);
```

## Animation Presets

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.step { animation: fadeIn 0.3s ease; }

/* Spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.spinner { animation: spin 0.8s linear infinite; }

/* Smooth transition */
transition: all 0.2s ease;
```

## Typography Scale

```
H1: 32px, 700, #0f172a, -0.5px spacing
H2: 28px, 700, #0f172a
H3: 15px, 700, #1e293b, 0.5px spacing (uppercase)

Body Large: 16px, 500, #64748b
Body Regular: 15px, 500, #1e293b
Body Small: 14px, 400, #64748b
Body Tiny: 13px, 400, #94a3b8
```

## Common States

### Success State
```css
.success {
  background: #f0fdf4;
  border: 1px solid #22c55e;
  color: #15803d;
}
```

### Error State
```css
.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
}
```

### Loading State
```css
.loading {
  background: #f8fafc;
  border-radius: 10px;
  padding: 48px;
  text-align: center;
  position: relative;
}
.loading::after {
  content: '';
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

### Disabled State
```css
.disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.5;
}
```

## Layout Grid

```css
/* 1-column responsive grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

/* Standard spacing */
.section { margin: 28px 0; }
.component { margin: 20px 0; }
.element { margin: 12px 0; }
```

## Text Styling

```css
/* Heading */
h2 {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;
}

/* Label */
label {
  display: block;
  margin-bottom: 10px;
  color: #1e293b;
  font-weight: 600;
  font-size: 15px;
}

/* Hint */
small {
  display: block;
  margin-top: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
}

/* Error Message */
.error-msg {
  margin-top: 8px;
  padding: 12px 14px;
  background: #fef2f2;
  color: #dc2626;
  border-left: 3px solid #ef4444;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}
```

## Flexbox Utilities

```css
/* Centered container */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Space between items */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Column layout */
.flex-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Row layout */
.flex-row {
  display: flex;
  gap: 12px;
}

/* Full width button in flex */
button { flex: 1; }
```

## Performance Tips

1. Use `transform` for animations (GPU accelerated)
2. Avoid `box-shadow` on hover if heavy
3. Use `will-change: transform` sparingly
4. Prefer `opacity` over `display` for visibility
5. Debounce resize listeners
6. Lazy load large grids
7. Use CSS containment for complex components

## Accessibility Checklist

- Color contrast ratio ≥ 4.5:1 for text
- Focus states visible (outline or glow)
- ARIA labels where needed
- Semantic HTML (button, label, form)
- Keyboard navigation works
- Touch targets ≥ 44x44px on mobile
- Disabled state clearly visible
- Error messages linked to inputs (aria-describedby)

## CSS Variable Template

```css
:root {
  /* Colors */
  --color-primary: #4f46e5;
  --color-success: #22c55e;
  --color-error: #dc2626;
  
  /* Text */
  --text-dark: #0f172a;
  --text-muted: #64748b;
  
  /* Backgrounds */
  --bg-page: #f5f7fa;
  --bg-card: #f8fafc;
  
  /* Sizing */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 16px;
  
  /* Spacing */
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 40px;
}

/* Usage */
.button {
  background: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
}
```


