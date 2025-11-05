import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, Typo } from '@zzz-picker/components/v2'
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
    name: 'input',
  },
} satisfies Meta<typeof Form.Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'text',
    value: 'Hello, world!',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    }

    return <Form.Input {...args} value={value} onChange={onChange} />
  },
}

export const Name: Story = {
  args: {
    type: 'text',
    value: '',
    placeholder: '닉네임을 입력해주세요',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
    }

    return (
      <div className="flex gap-4 items-center">
        <Form.Nickname {...args} side="A" value={value} onChange={onChange} />
        <Typo.Heading className="heading-3xl">VS</Typo.Heading>
        <Form.Nickname {...args} side="B" value={value} onChange={onChange} />
      </div>
    )
  },
}
