import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    // Disable lightningcss explicitly
    transformer: 'postcss'
  },
  esbuild: {
    // In case lightningcss sneaks in via esbuild
    legalComments: 'none'
  }
})
