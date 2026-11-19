import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, existsSync } from 'node:fs'

// Copies dist/index.html to dist/404.html so static hosts (like Render)
// serve the React SPA on page reloads without "Not Found" errors.
function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const indexPath = fileURLToPath(new URL('./dist/index.html', import.meta.url))
      const notFoundPath = fileURLToPath(new URL('./dist/404.html', import.meta.url))
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, notFoundPath)
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    spaFallbackPlugin(),
  ],
  resolve: {
    alias: {
      // '@' maps to 'src/' — consistent with shadcn/ui conventions
      "@": fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching
        manualChunks: (id: string) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'vendor'
          if (id.includes('node_modules/react-router')) return 'router'
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/class-variance') || id.includes('node_modules/clsx') || id.includes('node_modules/tailwind-merge')) return 'ui'
        },
      },
    },
  },
})
