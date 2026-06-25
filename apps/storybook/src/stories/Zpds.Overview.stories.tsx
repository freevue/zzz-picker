import type { Meta, StoryObj } from '@storybook/react'
import {
  Tabs,
  Button,
  Card,
  AgentProfile,
  Dialog,
  AgentGrid,
  TimeInput,
  NumberInput,
  NicknameInput,
  Number,
  AgentName,
  Heading,
} from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: { disable: true },
  },
} satisfies Meta

export default meta

export const ComponentCatalog: StoryObj = {
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="min-h-screen bg-[var(--color-base)] p-8">
          <Story />
        </div>
      </MockStoreProvider>
    ),
  ],
  render: () => {
    const [tab, setTab] = useState('original')
    const [score, setScore] = useState(0)
    const [cost, setCost] = useState(12)
    const [nickname, setNickname] = useState('')
    const [min, setMin] = useState(1)
    const [sec, setSec] = useState(23)
    const [ms, setMs] = useState(45)

    const agents = [
      { id: 156728 as const, attribute: 'Ether' as const, specialty: 'Dps' as const },
      { id: 113671 as const, attribute: 'Physical' as const, specialty: 'Dps' as const },
      { id: 104612 as const, attribute: 'Ice' as const, specialty: 'Support' as const },
      { id: 138652 as const, attribute: 'Electric' as const, specialty: 'Anomaly' as const },
    ]

    return (
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div>
          <Heading level="2xl">ZPDS 컴포넌트 카탈로그</Heading>
          <p className="text-sm text-[var(--color-ink)]/50 mt-1">V3 파스텔 테마 · 디자인 리뉴얼 1차 컴포넌트</p>
        </div>

        <section className="flex flex-col gap-3">
          <Heading level="md">Tabs</Heading>
          <Tabs
            value={tab}
            onChange={setTab}
            list={[
              { value: 'original', label: '정식 로프꾼' },
              { value: 'legend', label: '레전드' },
              { value: 'unlimited', label: '공허사냥꾼' },
            ]}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Heading level="md">Button</Heading>
          <div className="flex gap-3 flex-wrap">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="neutral">Neutral</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Heading level="md">Card</Heading>
          <div className="grid grid-cols-3 gap-4">
            <Card variant="default"><p className="text-xs">default</p></Card>
            <Card variant="elevated"><p className="text-xs">elevated</p></Card>
            <Card variant="outline"><p className="text-xs">outline</p></Card>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Heading level="md">AgentProfile · Typo</Heading>
          <div className="flex items-end gap-6">
            <AgentProfile agentId={156728} size="lg" showName />
            <div className="flex flex-col gap-2">
              <Number value={score} size="xl" animated suffix="점" />
              <AgentName agentId={156728} size="lg" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Card>
            <Heading level="sm" className="mb-3">NicknameInput</Heading>
            <NicknameInput
              side="A"
              nickname={nickname}
              onNicknameChange={setNickname}
              onCopyLink={() => {}}
            />
          </Card>
          <Card>
            <Heading level="sm" className="mb-3">NumberInput · TimeInput</Heading>
            <div className="flex flex-col gap-4">
              <NumberInput value={cost} onChange={setCost} label="코스트" max={24} />
              <TimeInput minutes={min} seconds={sec} milliseconds={ms} onChange={(m, s, msVal) => { setMin(m); setSec(s); setMs(msVal) }} />
            </div>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <Heading level="md">AgentGrid</Heading>
          <AgentGrid agents={agents} onSelect={() => {}} />
        </section>
      </div>
    )
  },
}
