/* eslint-env node */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    transformMode: {
      web: [/\.[jt]sx$/],
    },
  },
})
