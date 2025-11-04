import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

const meta = {
  title: 'Form/Party',
  component: Form.Party,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    deleteable: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    value: [null, null, null],
  },
} satisfies Meta<typeof Form.Party>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
    deleteable: true,
    cost: [0, 0, 0],
  },
  render: (args) => {
    const [value, setValue] = useState<(number | null)[]>(args.value)

    return <Form.Party {...args} value={value} onChange={setValue} />
  },
}

export const Full: Story = {
  args: {
    size: 'md',
    value: [156728, 156729, 154605],
  },
}
