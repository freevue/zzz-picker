import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog } from '@zzz-picker/components/v2'

const meta = {
  title: 'Dialog/Default',
  component: (args) => <Dialog className="text-ink" {...args} />,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    children: { control: 'text' },
    onClose: { action: 'onClose' },
  },
  args: {
    isOpen: false,
    children: 'Hello, world!',
  },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: false,
  },
}
