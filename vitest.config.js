 
/* eslint-env node */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
