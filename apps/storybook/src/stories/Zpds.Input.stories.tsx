import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@zzz-picker/zpds'

const meta = {
  title: 'ZPDS/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    themeColor: { control: 'select', options: ['primary', 'secondary'] },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: '텍스트를 입력해 주십시오...',
    themeColor: 'secondary',
    disabled: false,
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const PrimaryFocus: Story = {
  args: {
    themeColor: 'primary',
  },
}

export const SecondaryFocus: Story = {
  args: {
    themeColor: 'secondary',
  },
}
