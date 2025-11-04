import type { Meta, StoryObj } from '@storybook/react-vite'
import { Agent } from '@zzz-picker/components/v2'

const meta = {
  title: 'Agent/Profile',
  component: Agent.Profile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'number' },
    className: { control: 'text' },
    flat: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
  },
  args: {
    id: 156728,
  },
} satisfies Meta<typeof Agent.Profile>

export default meta

type Story = StoryObj<typeof meta>

export const Profile: Story = {
  args: {
    id: 156728,
    size: 'md',
    flat: false,
  },
}
