import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('original')
    return (
      <div className="w-[450px]">
        <Tabs
          value={val}
          onChange={(v) => setVal(v)}
          list={[
            { value: 'original', label: '정식 로프꾼 (24C)' },
            { value: 'legend', label: '레전드 로프꾼 (무한)' },
            { value: 'unlimited', label: '공허사냥꾼 (무제한)' }
          ]}
        />
      </div>
    )
  }
}
