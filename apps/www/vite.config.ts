import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    remix(),
    // react({
    //   babel: {
    //     plugins: [['babel-plugin-react-compiler']],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './'),
    },
  },
  define: {
    'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
    'process.env.GOOGLE_SHEET_ID': JSON.stringify(process.env.GOOGLE_SHEET_ID),
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
  },
  build: {
    rollupOptions: {
      external: ['./scripts/**/*'],
    },
  },
})
