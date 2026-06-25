import type { Meta, StoryObj } from '@storybook/react'
import { AgentProfile } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React from 'react'

const meta = {
  title: 'ZPDS/AgentProfile',
  component: AgentProfile,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <Story />
      </MockStoreProvider>
    ),
  ],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    showName: { control: 'boolean' },
    flat: { control: 'boolean' },
  },
  args: {
    agentId: 156728,
    size: 'md',
    showName: false,
    flat: false,
  },
} satisfies Meta<typeof AgentProfile>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithName: Story = {
  args: { showName: true },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <AgentProfile key={size} agentId={156728} size={size} showName />
      ))}
    </div>
  ),
}

export const Flat: Story = {
  args: { flat: true, showName: true, size: 'lg' },
}
