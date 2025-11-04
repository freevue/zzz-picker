import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

const meta = {
  title: 'Form/Score',
  component: Form.Score,
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
} satisfies Meta<typeof Form.Score>

export default meta

type Story = StoryObj<typeof meta>

export const Score: Story = {
  args: {
    value: '100',
  },
}
