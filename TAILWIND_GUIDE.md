# Tailwind CSS Guide

This guide shows you how to use Tailwind CSS in your React application.

## Basic Concepts

Tailwind CSS is a utility-first CSS framework. Instead of writing custom CSS, you compose classes directly in your HTML/JSX.

### Example: Traditional CSS vs Tailwind

**Traditional CSS:**
```css
.button {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 600;
}

.button:hover {
  background-color: #2563eb;
}
```

**Tailwind CSS:**
```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700">
  Click me
</button>
```

## Common Utility Classes

### Layout
- `flex` - Display flex
- `grid` - Display grid
- `block` - Display block
- `inline` - Display inline
- `hidden` - Display none

### Spacing
- `p-4` - Padding: 1rem
- `m-4` - Margin: 1rem
- `px-4` - Horizontal padding: 1rem
- `py-4` - Vertical padding: 1rem
- `space-x-4` - Horizontal gap between children

### Sizing
- `w-full` - Width: 100%
- `h-screen` - Height: 100vh
- `max-w-md` - Max width: 28rem
- `min-h-screen` - Min height: 100vh

### Typography
- `text-sm` - Font size: 0.875rem
- `text-lg` - Font size: 1.125rem
- `font-bold` - Font weight: 700
- `text-center` - Text align: center
- `uppercase` - Text transform: uppercase

### Colors
- `bg-blue-500` - Background color
- `text-white` - Text color
- `border-gray-300` - Border color

### Borders & Rounding
- `border` - Border: 1px solid
- `border-2` - Border: 2px solid
- `rounded` - Border radius: 0.25rem
- `rounded-lg` - Border radius: 0.5rem
- `rounded-full` - Border radius: 9999px

### Shadows & Effects
- `shadow` - Box shadow
- `shadow-lg` - Large box shadow
- `shadow-xl` - Extra large box shadow
- `hover:shadow-2xl` - Apply on hover

### Responsive Design
- `sm:` - Min width 640px
- `md:` - Min width 768px
- `lg:` - Min width 1024px
- `xl:` - Min width 1280px
- `2xl:` - Min width 1536px

Example:
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>
```

### State Variants
- `hover:` - On hover
- `focus:` - On focus
- `active:` - On active
- `disabled:` - When disabled

Example:
```jsx
<button className="bg-blue-500 hover:bg-blue-700 active:bg-blue-900">
  Click me
</button>
```

## Common Patterns

### Card Component
```jsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
  <h3 className="text-xl font-bold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here.</p>
</div>
```

### Button Component
```jsx
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
  Button
</button>
```

### Input Field
```jsx
<input 
  type="text" 
  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text..."
/>
```

### Centered Container
```jsx
<div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
    {/* Your content */}
  </div>
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Gradient Background
```jsx
<div className="bg-gradient-to-r from-purple-500 to-pink-500">
  {/* Content with gradient background */}
</div>
```

## Customizing Tailwind

Edit `tailwind.config.js` to customize:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': '#FF6B6B',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
```

Then use your custom values:
```jsx
<div className="bg-brand text-white p-128 font-sans">
  Custom styled content
</div>
```

## Best Practices

1. **Use @apply for repeated patterns** (in CSS files):
```css
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
}
```

2. **Extract complex components**:
Instead of long className strings, create reusable components.

3. **Use responsive design**:
Start mobile-first, then add larger breakpoints.

4. **Leverage VSCode extensions**:
- Tailwind CSS IntelliSense
- Headwind (class sorting)

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)
- [Tailwind Color Reference](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind Play](https://play.tailwindcss.com/) - Online playground

