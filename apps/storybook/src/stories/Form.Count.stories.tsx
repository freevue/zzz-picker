import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'
import { useEffect, useState } from 'react'

const meta = {
  title: 'Form/Count',
  component: Form.Count,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
    max: { control: 'number' },
    min: { control: 'number' },
  },
  args: {
    value: 0,
    max: 10,
    min: 0,
  },
} satisfies Meta<typeof Form.Count>

export default meta

type Story = StoryObj<typeof meta>

export const Count: Story = {
  args: {
    value: 0,
    name: 'count',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)

    useEffect(() => {
      setValue(args.value)
    }, [args.value])

    return <Form.Count {...args} className="w-96" value={value} name="count" onChange={setValue} />
  },
}
