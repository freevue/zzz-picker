import pkg from './package.json'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [tailwindcss(), remix()],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './'),
      },
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version),
      'process.env.R2_ACCOUNT_ID': JSON.stringify(env.R2_ACCOUNT_ID),
      'process.env.R2_ACCESS_KEY_ID': JSON.stringify(env.R2_ACCESS_KEY_ID),
      'process.env.R2_SECRET_ACCESS_KEY': JSON.stringify(env.R2_SECRET_ACCESS_KEY),
      'process.env.R2_BUCKET_NAME': JSON.stringify(env.R2_BUCKET_NAME),
      'process.env.R2_PUBLIC_URL': JSON.stringify(env.R2_PUBLIC_URL),
    },
  }
})
