import type { Meta, StoryObj } from '@storybook/react'
import Bracket from '@/components/Bracket'

const meta = {
  title: 'Tournament/Bracket',
  component: Bracket,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    storageKey: {
      control: 'text',
      description: '로컬스토리지 저장 키',
    },
    className: {
      control: 'text',
      description: '컨테이너 추가 클래스',
    },
  },
} satisfies Meta<typeof Bracket>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    storageKey: 'storybook-bracket-default',
  },
  render: (args) => (
    <div className="w-screen h-screen bg-[#0c0f12] overflow-hidden">
      <Bracket {...args} />
    </div>
  ),
}

export const IsolatedSession: Story = {
  args: {
    storageKey: 'storybook-bracket-isolated',
  },
  render: (args) => (
    <div className="w-screen h-screen bg-[#0c0f12] overflow-hidden">
      <Bracket {...args} />
    </div>
  ),
}
