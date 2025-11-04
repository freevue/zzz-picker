import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs as TabsComponent } from '@zzz-picker/components/v2'
import { useState } from 'react'

const meta = {
  title: 'Tabs',
  component: TabsComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    list: { control: 'object' },
    value: { control: 'text' },
    onChange: { action: 'onChange' },
  },
  args: {
    list: [
      { value: '1', label: 'Tab 1' },
      { value: '2', label: 'Tab 2' },
      { value: '3', label: 'Tab 3' },
    ],
    value: '1',
  },
} satisfies Meta<typeof TabsComponent>

export default meta

type Story = StoryObj<typeof meta>

export const Tabs: Story = {
  args: {
    list: [
      { value: '1', label: 'Tab 1' },
      { value: '2', label: 'Tab 2' },
      { value: '3', label: 'Tab 3' },
    ],
    value: '1',
  },
  render: (args) => {
    const [value, setValue] = useState(args.value)

    return (
      <div className="bg-content p-8 rounded-bl-2xl rounded-tr-2xl">
        <TabsComponent {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
