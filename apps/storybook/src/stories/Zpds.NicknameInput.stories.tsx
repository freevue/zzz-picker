import type { Meta, StoryObj } from '@storybook/react'
import { NicknameInput } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/NicknameInput',
  component: NicknameInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NicknameInput>

export default meta
type Story = StoryObj<typeof meta>

export const SideA: Story = {
  render: () => {
    const [name, setName] = useState('')
    return (
      <div className="w-[320px]">
        <NicknameInput
          nickname={name}
          onNicknameChange={setName}
          onCopyLink={() => alert(`🔗 Side A 선수 (${name})의 링크가 복사되었습니다.`)}
          side="A"
        />
      </div>
    )
  }
}

export const SideB: Story = {
  render: () => {
    const [name, setName] = useState('제로원')
    return (
      <div className="w-[320px]">
        <NicknameInput
          nickname={name}
          onNicknameChange={setName}
          onCopyLink={() => alert(`🔗 Side B 선수 (${name})의 링크가 복사되었습니다.`)}
          side="B"
        />
      </div>
    )
  }
}
