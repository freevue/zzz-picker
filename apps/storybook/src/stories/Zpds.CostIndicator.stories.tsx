import type { Meta, StoryObj } from '@storybook/react'
import { CostIndicator } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/CostIndicator',
  component: CostIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CostIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Safe: Story = {
  args: {
    currentCost: 18,
    maxCost: 24,
    label: '선수 A 파티 코스트 지표'
  }
}

export const Overflow: Story = {
  args: {
    currentCost: 26,
    maxCost: 24,
    label: '선수 B 파티 코스트 지표'
  }
}

export const Interactive: Story = {
  render: () => {
    const [cost, setCost] = useState(16)
    return (
      <div className="w-[320px] flex flex-col gap-4">
        <CostIndicator currentCost={cost} maxCost={24} />
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCost(prev => Math.max(0, prev - 2))}
            className="px-3 py-1 bg-[var(--color-netural)] border border-[var(--color-ink)]/10 text-xs font-bold text-[var(--color-ink)] rounded cursor-pointer"
          >
            -2 Cost
          </button>
          <button
            onClick={() => setCost(prev => prev + 2)}
            className="px-3 py-1 bg-[var(--color-netural)] border border-[var(--color-primary)]/20 text-xs font-bold text-[var(--color-primary)] rounded cursor-pointer"
          >
            +2 Cost
          </button>
        </div>
      </div>
    )
  }
}
