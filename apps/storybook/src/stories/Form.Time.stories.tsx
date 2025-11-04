import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'
import { useEffect, useState } from 'react'

const meta = {
  title: 'Form/Time',
  component: Form.Time,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'number' },
  },
  args: {
    value: 0,
  },
} satisfies Meta<typeof Form.Time>

export default meta

type Story = StoryObj<typeof meta>

export const Time: Story = {
  args: {
    value: 0,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)

    useEffect(() => {
      setValue(args.value)
    }, [args.value])

    return <Form.Time {...args} value={value} onChange={setValue} />
  },
}
