import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',  // Relative paths for custom domain
  build: {
    outDir: 'docs'
  },
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    }
  }
})
