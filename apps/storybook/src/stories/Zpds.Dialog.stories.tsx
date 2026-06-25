import type { Meta, StoryObj } from '@storybook/react'
import { Dialog, Button, Heading } from '@zzz-picker/zpds'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/Dialog',
  component: Dialog,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-8">
        <Button onClick={() => setOpen(true)}>다이얼로그 열기</Button>
        <Dialog isOpen={open} onClose={() => setOpen(false)}>
          <Heading level="lg">에이전트 선택</Heading>
          <p className="text-sm text-[var(--color-ink)]/60 mt-3">
            다이얼로그 팝업 콘텐츠 영역입니다. ESC 키 또는 배경 클릭으로 닫을 수 있습니다.
          </p>
        </Dialog>
      </div>
    )
  },
}

export const NonCloseable: Story = {
  render: () => (
    <Dialog isOpen closeable={false}>
      <Heading level="md">확인 필요</Heading>
      <p className="text-sm text-[var(--color-ink)]/60 mt-3">닫기 버튼이 없는 다이얼로그입니다.</p>
    </Dialog>
  ),
}
