import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form } from '@zzz-picker/components/v2'

const meta = {
  title: 'Form/Party',
  component: Form.Party,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'object' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    value: [156728, 156729, 154605],
  },
} satisfies Meta<typeof Form.Party>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
    value: [156728, 156729, 154605],
  },
}

export const Empty: Story = {
  args: {
    size: 'md',
    value: [null, null, null],
  },
}
