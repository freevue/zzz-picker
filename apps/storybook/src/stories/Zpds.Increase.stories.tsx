import type { Meta, StoryObj } from '@storybook/react'
import { Increase } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/Increase',
  component: Increase,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Increase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(0)
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="text-4xl font-extrabold text-[var(--color-primary)] font-mono">
          <Increase value={val} prefix="Cost" />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setVal((prev) => prev + 12)}
            className="px-3 py-1.5 bg-[var(--color-netural)] border border-[var(--color-secondary)]/25 text-xs font-bold text-[var(--color-secondary)] rounded cursor-pointer"
          >
            +12 추가
          </button>
          <button 
            onClick={() => setVal(0)}
            className="px-3 py-1.5 bg-[var(--color-netural)] border border-[var(--color-tertiary)]/25 text-xs font-bold text-[var(--color-tertiary)] rounded cursor-pointer"
          >
            초기화
          </button>
        </div>
      </div>
    )
  }
}
