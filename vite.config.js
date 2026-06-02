import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    http: {
      allowReserveFull: true,
    },
  },
  build: {
    // Pakai esbuild minifier supaya tidak error saat parse CSS modern
    // seperti 100svh yang lightningcss minifier rewel.
    minify: 'esbuild',
  },
  optimizeDeps: {
    exclude: ['better-sqlite3'],
  },
})