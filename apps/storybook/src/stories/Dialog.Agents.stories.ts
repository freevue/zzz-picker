import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog } from '@zzz-picker/components/v2'

const meta = {
  title: 'Dialog/Agents',
  component: Dialog.Agents,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    allowAgents: { control: 'object' },
    banAgents: { control: 'object' },
    activeAgent: { control: 'object' },
    onClose: { action: 'onClose' },
    onSelect: { action: 'onSelect' },
  },
  args: {
    isOpen: false,
    allowAgents: [156728, 156729, 154605],
    banAgents: [156730, 156731, 156732],
  },
} satisfies Meta<typeof Dialog.Agents>

export default meta

type Story = StoryObj<typeof meta>

export const Agents: Story = {
  args: {
    isOpen: false,
    allowAgents: [156728, 156729, 154605],
    banAgents: [156730, 156731, 156732],
  },
}
