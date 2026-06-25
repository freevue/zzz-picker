import type { Meta, StoryObj } from '@storybook/react'
import { Number, AgentName } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React from 'react'

const meta = {
  title: 'ZPDS/Typo',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const NumberDisplay: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-6 items-center">
      <Number value={65000} size="xl" />
      <Number value={24500} size="lg" suffix="점" />
      <Number value={1280} size="md" prefix="Cost" />
      <Number value={42} size="sm" />
    </div>
  ),
}

export const NumberAnimated: StoryObj = {
  render: () => {
    const [val, setVal] = React.useState(12000)

    React.useEffect(() => {
      const id = setInterval(() => setVal((v) => v + Math.floor(Math.random() * 500)), 2000)
      return () => clearInterval(id)
    }, [])

    return (
      <div className="flex flex-col items-center gap-4">
        <Number value={val} size="xl" animated suffix="점" />
        <p className="text-xs text-[var(--color-ink)]/40">2초마다 자동 증가 (Increase 애니메이션)</p>
      </div>
    )
  },
}

export const AgentNameDisplay: StoryObj = {
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <Story />
      </MockStoreProvider>
    ),
  ],
  render: () => (
    <div className="flex flex-col gap-4 items-center">
      <AgentName agentId={156728} size="lg" />
      <AgentName agentId={113671} size="md" />
      <AgentName agentId={104612} size="sm" />
      <AgentName name="커스텀 이름" rarity="S" size="md" />
    </div>
  ),
}
