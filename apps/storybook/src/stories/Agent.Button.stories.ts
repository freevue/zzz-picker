import type { Meta, StoryObj } from '@storybook/react-vite'
import { Agent } from '@zzz-picker/components/v2'

const meta = {
  title: 'Agent/Button',
  component: Agent.Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'number' },
    className: { control: 'text' },
    flat: { control: 'boolean' },
    naming: { control: 'boolean' },
    hover: { control: 'boolean' },
    active: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    children: { control: 'text' },
    onClick: { action: 'onClick' },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
  },
  args: {
    id: 156728,
  },
} satisfies Meta<typeof Agent.Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 156728,
    size: 'md',
    flat: false,
  },
}

export const Empty: Story = {
  args: {
    id: null,
  },
}

export const Disabled: Story = {
  args: {
    id: 156728,
    disabled: true,
  },
}
