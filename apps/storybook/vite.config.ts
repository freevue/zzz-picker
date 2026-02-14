import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../../'), '')

  return {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@zzz-picker/components/styles': path.resolve(
          __dirname,
          '../../packages/components/src/index.css'
        ),
        '@zzz-picker/components': path.resolve(__dirname, '../../packages/components/src'),
        '@zzz-picker/tailwind-config': path.resolve(
          __dirname,
          '../../packages/tailwind-config/src/index.css'
        ),
      },
    },
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(env.SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.SUPABASE_ANON_KEY),
    },
    esbuild: {
      jsx: 'automatic',
    },
  }
})
