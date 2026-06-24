import type { Meta, StoryObj } from '@storybook/react'
import { EngineCard } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React from 'react'

const meta = {
  title: 'ZPDS/EngineCard',
  component: EngineCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="w-[240px]">
          <Story />
        </div>
      </MockStoreProvider>
    )
  ],
} satisfies Meta<typeof EngineCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    engineId: 1, // Mock 엔진 ID
    rate: 1,
  }
}

export const Refined: Story = {
  args: {
    engineId: 1,
    rate: 5,
    active: true,
  }
}
