import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

const meta = {
  title: 'Form/Input',
  component: Form.Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
  },
  args: {
    value: '',
  },
} satisfies Meta<typeof Form.Input>

export default meta

type Story = StoryObj<typeof meta>

export const Input: Story = {
  args: {
    value: 'Hello, world!',
  },
}
