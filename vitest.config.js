// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // vous permet d'importer avec "@/..." plutôt que des ../../
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,           // activate describe/it/expect en global
    environment: 'jsdom',    // pour pouvoir monter des composants React
    setupFiles: 'src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
})
