import sharedConfig from '@zzz-picker/tailwind-config'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/components/src/**/*.{js,jsx,ts,tsx}',
    '../../apps/www/components/**/*.{js,jsx,ts,tsx}',
    '../../apps/www/app/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [sharedConfig],
}

export default config
