import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    transformer: 'postcss'
  },
  esbuild: {
    legalComments: 'none'
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app')
  }
})
