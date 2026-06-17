import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cognitive-triad-ranker/',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  }
})
