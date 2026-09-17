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
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            'charts': ['recharts'],
            'forms': ['react-hook-form'],
            'ui': ['react-hot-toast', 'react-icons'],
            'http': ['axios'],
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
