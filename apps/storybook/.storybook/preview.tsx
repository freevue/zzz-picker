import '../src/index.css'
import type { Preview } from '@storybook/react'
import { Store } from '@zzz-picker/provider'
import React, { useEffect } from 'react'

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: '',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: '', title: 'Default' },
          { value: 'v2', title: 'V2' },
          { value: 'alice', title: 'Alice' },
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
    viewport: {
      viewports: {
        streaming: {
          name: 'Streaming View (OBS)',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
        mobile_streaming: {
          name: 'Mobile Streaming',
          styles: {
            width: '360px',
            height: '640px',
          },
        },
      },
      defaultViewport: 'streaming',
    },
    backgrounds: {
      disable: true, // 테마 시스템과 충돌 방지를 위해 기본 배경색 기능 비활성화
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme

      useEffect(() => {
        // html 태그에 테마 클래스 적용
        const html = document.documentElement
        html.classList.remove('v2', 'alice')
        if (theme) {
          html.classList.add(theme)
        }
      }, [theme])

      return (
        <Store>
          <div className="p-8 min-h-screen font-sans transition-colors duration-200">
            <Story />
          </div>
        </Store>
      )
    },
  ],
}

export default preview
