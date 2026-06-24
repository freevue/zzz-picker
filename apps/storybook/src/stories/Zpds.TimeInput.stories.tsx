import type { Meta, StoryObj } from '@storybook/react'
import { TimeInput } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/TimeInput',
  component: TimeInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TimeInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [time, setTime] = useState({ min: 1, sec: 23, ms: 45 })
    return (
      <div className="w-[320px]">
        <TimeInput
          minutes={time.min}
          seconds={time.sec}
          milliseconds={time.ms}
          onChange={(m, s, ms) => setTime({ min: m, sec: s, ms: ms })}
          label="클리어 타임 레코드 입력"
        />
      </div>
    )
  }
}
