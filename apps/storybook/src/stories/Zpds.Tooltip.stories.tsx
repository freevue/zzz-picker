import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from '@zzz-picker/zpds'
import React from 'react'

const meta = {
  title: 'ZPDS/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Top: Story = {
  render: () => (
    <div className="py-12">
      <Tooltip content="W-엔진의 재련 성급에 따라 코스트가 차등 가산됩니다." placement="top">
        <span className="text-[var(--color-primary)] font-bold cursor-help border-b border-dashed border-[var(--color-primary)]">
          [상단 툴팁] 코스트 규칙 가이드
        </span>
      </Tooltip>
    </div>
  )
}

export const Bottom: Story = {
  render: () => (
    <div className="py-12">
      <Tooltip content="선택하신 보스는 라운드 2의 공용 보스로 자동 할당됩니다." placement="bottom">
        <span className="text-[var(--color-secondary)] font-bold cursor-help border-b border-dashed border-[var(--color-secondary)]">
          [하단 툴팁] 보스 규격 정보
        </span>
      </Tooltip>
    </div>
  )
}
