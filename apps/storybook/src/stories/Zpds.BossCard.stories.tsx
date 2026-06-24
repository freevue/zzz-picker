import type { Meta, StoryObj } from '@storybook/react'
import { BossCard } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React from 'react'

const meta = {
  title: 'ZPDS/BossCard',
  component: BossCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="w-[200px]">
          <Story />
        </div>
      </MockStoreProvider>
    )
  ],
} satisfies Meta<typeof BossCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    bossId: 1, // Mock 보스 ID 1 (타나토스)
  }
}

export const Active: Story = {
  args: {
    bossId: 1,
    active: true,
  }
}

export const Disabled: Story = {
  args: {
    bossId: 2,
    disabled: true,
  }
}
