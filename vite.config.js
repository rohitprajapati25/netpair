import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    // ── Chunk splitting strategy ────────────────────────────────────────────
    // Vendor libs that rarely change get their own long-cached chunk.
    // Page chunks are already split by React.lazy() in App.jsx.
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — cached forever after first load
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Data fetching layer
          'vendor-query': ['@tanstack/react-query'],
          // Chart libraries (heavy — isolate so pages without charts stay lean)
          'vendor-charts': ['recharts'],
          // Socket.io client
          'vendor-socket': ['socket.io-client'],
        },
      },
    },

    // Warn when any single chunk exceeds 500 KB
    chunkSizeWarningLimit: 500,

    // Use esbuild minifier (default, fastest)
    minify: 'esbuild',

    // Generate source maps for production error tracking (optional — remove if not needed)
    sourcemap: false,
  },
})
