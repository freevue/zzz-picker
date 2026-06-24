import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@zzz-picker/zpds'

const meta = {
  title: 'ZPDS/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'neutral'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'ACTION BUTTON',
    variant: 'primary',
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
