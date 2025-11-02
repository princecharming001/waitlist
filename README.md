# React + Vite + Tailwind CSS

A modern React application built with Vite and styled with Tailwind CSS.

## Features

- ⚡️ Lightning-fast development with Vite
- ⚛️ React 18 with modern hooks
- 🎨 Tailwind CSS for utility-first styling
- 🔥 Hot Module Replacement (HMR)
- 📦 Optimized production builds

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd my-react-app
```

2. Install dependencies (already done):
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port). 

Check the terminal output for the exact URL after starting the server.

### Build for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
my-react-app/
├── src/
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── public/              # Public static files
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration
```

## Customization

### Tailwind CSS

Customize your Tailwind configuration in `tailwind.config.js`:
- Add custom colors
- Extend the default theme
- Add plugins
- Configure content paths

### Vite

Modify Vite settings in `vite.config.js` for:
- Build optimization
- Plugin configuration
- Server settings
- Path aliases

## Learn More

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
