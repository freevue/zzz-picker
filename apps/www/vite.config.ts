import pkg from './package.json'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

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
      'process.env.ROLE_TOKEN_SECRET': JSON.stringify(
        env.ROLE_TOKEN_SECRET || 'zzz-picker-secret-key'
      ),
      'process.env.GOOGLE_API_KEY': JSON.stringify(env.GOOGLE_API_KEY),
      'process.env.GOOGLE_SHEET_ID': JSON.stringify(env.GOOGLE_SHEET_ID),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    build: {
      rollupOptions: {
        external: ['./scripts/**/*'],
      },
    },
  }
})
