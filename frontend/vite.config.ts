import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBase = (env.VITE_API_BASE || 'http://localhost:8080')
    .replace(/\/+$/, '')
    .replace(/\/api$/, '')

  return {
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            router: ['react-router-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            editor: ['quill', 'react-quill-new'],
            ui: ['@tabler/icons-react', 'sonner'],
          },
        },
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiBase,
          changeOrigin: true,
        },
      },
    },
  }
})
