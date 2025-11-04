import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typo } from '@zzz-picker/components/v2'

const meta = {
  title: 'Typo/Heading',
  component: Typo.Heading,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'number' },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Typo.Heading>

export default meta

type Story = StoryObj<typeof meta>

export const Heading: Story = {
  args: {
    heading: 1,
    children: undefined,
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Typo.Heading heading={args.heading} className="heading-4xl">
        {args.children || 'Heading-4xl'}
      </Typo.Heading>
      <Typo.Heading heading={args.heading} className="heading-3xl">
        {args.children || 'Heading-3xl'}
      </Typo.Heading>
      <Typo.Heading heading={args.heading} className="heading-2xl">
        {args.children || 'Heading-2xl'}
      </Typo.Heading>
      <Typo.Heading heading={args.heading} className="heading-xl">
        {args.children || 'Heading-xl'}
      </Typo.Heading>
      <Typo.Heading heading={args.heading} className="heading-lg">
        {args.children || 'Heading-lg'}
      </Typo.Heading>
      <Typo.Heading heading={args.heading} className="heading-md">
        {args.children || 'Heading-md'}
      </Typo.Heading>
    </div>
  ),
}
