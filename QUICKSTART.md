# Quick Start Guide

Get your React + Vite + Tailwind CSS app up and running in minutes!

## 🚀 Quick Commands

```bash
# Navigate to project directory
cd my-react-app

# Start development server (already done!)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
my-react-app/
├── src/
│   ├── App.jsx              # Main application component (styled with Tailwind)
│   ├── main.jsx             # Application entry point
│   ├── index.css            # Global styles with Tailwind directives
│   ├── components/          # Reusable components
│   │   └── Card.jsx         # Example card component
│   └── examples/            # Example components showcasing Tailwind
│       ├── ButtonExamples.jsx
│       └── FormExamples.jsx
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.js          # Vite configuration
```

## 🎨 What's Included

### Main App (`src/App.jsx`)
A beautiful demo page featuring:
- Gradient background
- Animated logos
- Interactive counter
- Feature cards
- Modern UI components

### Example Components
- **ButtonExamples.jsx** - Various button styles and states
- **FormExamples.jsx** - Form inputs and layouts
- **Card.jsx** - Reusable card component

## 🛠️ Development Tips

### 1. Start Simple
Begin by editing `src/App.jsx` to see changes instantly with Hot Module Replacement (HMR).

### 2. Use Tailwind Utilities
Instead of writing CSS, use Tailwind's utility classes:
```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello World
</div>
```

### 3. Create Reusable Components
Extract repeated patterns into components in the `src/components/` directory.

### 4. Customize Tailwind
Edit `tailwind.config.js` to add custom colors, fonts, and spacing.

### 5. Check Examples
Look at the files in `src/examples/` for inspiration and patterns.

## 📚 Learning Resources

- **TAILWIND_GUIDE.md** - Comprehensive Tailwind CSS guide with examples
- **README.md** - Full project documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vite.dev/guide/)
- [React Docs](https://react.dev)

## ✨ Your First Steps

1. **Open the app** - Visit http://localhost:5173 (check terminal for actual port)
2. **Edit App.jsx** - Change some text and see it update instantly
3. **Try Tailwind** - Add utility classes to elements
4. **Create a component** - Make your first custom component
5. **Explore examples** - Check out ButtonExamples and FormExamples

## 🎯 Common Tasks

### Add a New Page
```jsx
// src/pages/About.jsx
export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold">About Page</h1>
    </div>
  )
}
```

### Create a Button Component
```jsx
// src/components/Button.jsx
export default function Button({ children, variant = "primary" }) {
  const styles = {
    primary: "bg-blue-500 hover:bg-blue-700",
    secondary: "bg-gray-500 hover:bg-gray-700"
  }
  
  return (
    <button className={`${styles[variant]} text-white font-bold py-2 px-4 rounded`}>
      {children}
    </button>
  )
}
```

### Add Custom Colors
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'brand': '#FF6B6B',
      'accent': '#4ECDC4'
    }
  }
}
```

## 🐛 Troubleshooting

### Port already in use?
Vite will automatically try the next available port.

### Styles not updating?
Try stopping the dev server (Ctrl+C) and running `npm run dev` again.

### Build errors?
Run `npm run build` to check for any TypeScript or linting errors.

## 🎉 Ready to Build!

You now have a fully functional React app with Vite and Tailwind CSS. Start building your amazing project!

Happy coding! 🚀

