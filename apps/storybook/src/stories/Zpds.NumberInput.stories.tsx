import type { Meta, StoryObj } from '@storybook/react'
import { NumberInput, Card } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/NumberInput',
  component: NumberInput,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(0)
    return (
      <Card className="w-[300px]">
        <NumberInput value={val} onChange={setVal} label="코스트 입력" max={24} />
      </Card>
    )
  },
}

export const Score: Story = {
  render: () => {
    const [val, setVal] = useState(32500)
    return (
      <Card className="w-[300px]">
        <NumberInput
          value={val}
          onChange={setVal}
          label="점수"
          max={65000}
          showPreview
        />
      </Card>
    )
  },
}
