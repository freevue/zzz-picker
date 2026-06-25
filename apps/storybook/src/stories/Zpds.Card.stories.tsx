import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '@zzz-picker/zpds'

const meta = {
  title: 'ZPDS/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'elevated', 'outline'] },
    padding: { control: 'select', options: ['none', 'sm', 'md', 'lg'] },
  },
  args: {
    variant: 'default',
    padding: 'md',
    children: '카드 콘텐츠 영역',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Elevated: Story = {
  args: { variant: 'elevated' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const WithContent: Story = {
  render: (args) => (
    <Card {...args} className="w-[320px]">
      <p className="text-sm font-bold text-[var(--color-ink)]">라운드 1 — 정식 로프꾼</p>
      <p className="text-xs text-[var(--color-ink)]/50 mt-2">카드 내부 콘텐츠를 감싸는 surface 컨테이너입니다.</p>
    </Card>
  ),
}
