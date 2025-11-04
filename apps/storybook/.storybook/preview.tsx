import '../src/index.css'
import type { Preview } from '@storybook/react'
import { Store, Apollo } from '@zzz-picker/provider'
import React, { useEffect } from 'react'

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'v2',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'alice', title: 'Alice' },
          { value: 'v2', title: 'V2' },
        ],
        showName: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme

      useEffect(() => {
        document.documentElement.className = theme
      }, [theme])

      return (
        <Apollo>
          <Store>
            <Story />
          </Store>
        </Apollo>
      )
    },
  ],
}

export default preview
