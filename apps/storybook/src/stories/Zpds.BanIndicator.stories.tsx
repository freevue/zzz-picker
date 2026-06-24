import type { Meta, StoryObj } from '@storybook/react'
import { BanIndicator } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React from 'react'

const meta = {
  title: 'ZPDS/BanIndicator',
  component: BanIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="w-[320px]">
          <Story />
        </div>
      </MockStoreProvider>
    )
  ],
} satisfies Meta<typeof BanIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const NoBans: Story = {
  args: {
    banList: [],
    side: 'A',
    label: '선수 A 밴 지정 현황'
  }
}

export const HasBans: Story = {
  args: {
    banList: [156728, 113671], // 예: 주연, 113671 ID
    side: 'B',
    label: '선수 B 밴 지정 현황'
  }
}
