import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

const meta = {
  title: 'Form/Time',
  component: Form.Time,
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
} satisfies Meta<typeof Form.Time>

export default meta

type Story = StoryObj<typeof meta>

export const Time: Story = {
  args: {
    value: '00:00:00',
  },
}
