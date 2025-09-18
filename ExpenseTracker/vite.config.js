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
  },
  define: {
    // Ensure environment variables are available at build time
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://expense-trackerapi.vercel.app')
  }
})
