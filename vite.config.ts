import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => ({
  base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
  plugins: [react()],
  server: {
    host: process.env.FIGMA_DEV_SERVER_HOST || '127.0.0.1',
    port: Number(process.env.PORT || 5173),
    strictPort: true,
  },
  preview: {
    host: process.env.FIGMA_DEV_SERVER_HOST || '127.0.0.1',
    port: Number(process.env.PORT || 4173),
  },
}))
