import type { Meta, StoryObj } from '@storybook/react'
import { AgentCard } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React from 'react'

const meta = {
  title: 'ZPDS/AgentCard',
  component: AgentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="w-[140px]">
          <Story />
        </div>
      </MockStoreProvider>
    )
  ],
} satisfies Meta<typeof AgentCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    agentId: 156728, // 주연 캐릭터
    rate: 0,
  }
}

export const ActiveHighBreak: Story = {
  args: {
    agentId: 156728,
    rate: 6,
    active: true,
  }
}

export const WithEngine: Story = {
  args: {
    agentId: 156728,
    rate: 2,
    engineId: 1,
    engineRate: 3,
  }
}

export const BannedOrDisabled: Story = {
  args: {
    agentId: 156728,
    disabled: true,
  }
}
