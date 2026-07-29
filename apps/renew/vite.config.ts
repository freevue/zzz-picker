import pkg from './package.json'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
      remix({
        ignoredRouteFiles: ['**/*.md'],
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './app'),
        '@': path.resolve(__dirname, './app'),
      },
    },
    server: {
      host: true,
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version),
      'process.env.ROLE_TOKEN_SECRET': JSON.stringify(
        env.ROLE_TOKEN_SECRET || 'zzz-picker-secret-key'
      ),
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
    },
  }
})
