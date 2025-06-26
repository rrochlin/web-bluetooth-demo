import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }), 
    viteReact(),
    basicSsl(),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    https: true,
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  worker: {
    format: 'es',
    plugins: () => [viteReact()],
  },
})
