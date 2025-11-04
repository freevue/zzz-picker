import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typo } from '@zzz-picker/components/v2'

const meta = {
  title: 'Typo/Body',
  component: Typo.Body,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
} satisfies Meta<typeof Typo.Body>

export default meta

type Story = StoryObj<typeof meta>

export const Body: Story = {
  args: {
    children: undefined,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Typo.Body className="body-2xl">{args.children || 'Body-2xl'}</Typo.Body>
      <Typo.Body className="body-xl">{args.children || 'Body-xl'}</Typo.Body>
      <Typo.Body className="body-lg">{args.children || 'Body-lg'}</Typo.Body>
      <Typo.Body className="body-md">{args.children || 'Body-md'}</Typo.Body>
      <Typo.Body className="body-sm">{args.children || 'Body-sm'}</Typo.Body>
    </div>
  ),
}
