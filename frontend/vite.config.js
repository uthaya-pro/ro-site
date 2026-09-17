import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load env vars for the current mode (.env, .env.development, .env.production …)
  const env = loadEnv(mode, process.cwd(), '')

  const apiBase = env.VITE_API_BASE_URL || 'http://localhost:5000'

  return {
    plugins: [react()],

    // ── Dev Server ─────────────────────────────────────────────────────────
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ── Preview Server (vite preview) ───────────────────────────────────────
    preview: {
      port: 4173,
      host: true,
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
          secure: false,
        },
      },
    },

    // ── Build Optimizations ─────────────────────────────────────────────────
    build: {
      // Target modern browsers — smaller, faster output
      target: 'es2020',

      // Emit source maps only in development builds
      sourcemap: mode !== 'production',

      // Warn when individual chunks exceed 500 kB
      chunkSizeWarningLimit: 500,

      rollupOptions: {
        output: {
          // Manual chunk splitting — keeps vendor libs separate for better caching
          // rolldown (Vite 8) requires manualChunks to be a function, not an object
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
              return 'react-vendor'
            }
            if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router/')) {
              return 'router'
            }
            if (id.includes('node_modules/recharts')) {
              return 'charts'
            }
            if (id.includes('node_modules/react-hook-form')) {
              return 'forms'
            }
            if (id.includes('node_modules/react-hot-toast') || id.includes('node_modules/react-icons')) {
              return 'ui'
            }
            if (id.includes('node_modules/axios')) {
              return 'http'
            }
          },
          // Content-hash filenames for long-term caching
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    // ── Dependency Pre-bundling ─────────────────────────────────────────────
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'axios',
        'react-hook-form',
        'react-hot-toast',
        'react-icons',
        'recharts',
      ],
    },
  }
})
