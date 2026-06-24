import type { Meta, StoryObj } from '@storybook/react'
import { ScoreInput } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/ScoreInput',
  component: ScoreInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScoreInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [score, setScore] = useState(3500)
    return (
      <div className="w-[320px]">
        <ScoreInput
          value={score}
          onChange={setScore}
          label="선수 A 1라운드 획득 점수"
        />
      </div>
    )
  }
}
