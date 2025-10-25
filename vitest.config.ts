import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
    },
    reporters: ['verbose'],
    projects: ['packages/*', '!packages/tailwind-config', '!packages/constant', '!packages/utils'],
  },
})
