import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const BaseTable: Story = {
  render: () => {
    const [scoreA, setScoreA] = useState('7890')
    const [scoreB, setScoreB] = useState('8520')

    return (
      <div className="w-[600px] p-4 bg-[var(--color-base)] rounded-xl border border-[var(--color-netural)]">
        <Table>
          <thead>
            <tr>
              <Table.Th>경기 선수</Table.Th>
              <Table.Th>1R 타임 어택 점수 (수정 가능)</Table.Th>
              <Table.Th>2R 공용 보스 타임 (수정 가능)</Table.Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Table.Td value="선수 A (제로원)" />
              <Table.Td value={scoreA} isEditable onChange={setScoreA} />
              <Table.Td value="01:23.45" />
            </tr>
            <tr>
              <Table.Td value="선수 B (프리뷰)" />
              <Table.Td value={scoreB} isEditable onChange={setScoreB} />
              <Table.Td value="01:18.90" />
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}
