import pkg from './package.json'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), remix()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './'),
      },
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      rollupOptions: {
        external: ['./scripts/**/*'],
      },
    },
  }
})
