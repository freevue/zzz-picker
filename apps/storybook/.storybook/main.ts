import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // viteFinal: async (config) => {
  //   const { mergeConfig } = await import('vite')

  //   return mergeConfig(config, {
  //     resolve: {
  //       alias: {
  //         '@': path.resolve(__dirname, '../../apps/www'),
  //         '~': path.resolve(__dirname, '../../apps/www'),
  //       },
  //     },
  //   })
  // },
}

export default config
