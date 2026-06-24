import type { Meta, StoryObj } from '@storybook/react'
import { AgentGrid } from '@zzz-picker/zpds'
import { MockStoreProvider } from '../decorators/MockProviders'
import React, { useState } from 'react'

const meta = {
  title: 'ZPDS/AgentGrid',
  component: AgentGrid,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockStoreProvider>
        <div className="w-[850px] max-w-full">
          <Story />
        </div>
      </MockStoreProvider>
    )
  ],
} satisfies Meta<typeof AgentGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: () => {
    const [selected, setSelected] = useState<number | null>(null)
    const mockAgents: any = [
      { id: 156728, nameKo: '주연', attribute: 'Ether', specialty: 'Dps' },
      { id: 113671, nameKo: '네코마타', attribute: 'Physical', specialty: 'Dps' },
      { id: 104612, nameKo: '소우카쿠', attribute: 'Ice', specialty: 'Support' },
      { id: 125191, nameKo: '콜레다', attribute: 'Fire', specialty: 'Stun' },
      { id: 138652, nameKo: '그레이스', attribute: 'Electric', specialty: 'Anomaly' },
      { id: 147551, nameKo: '벤', attribute: 'Fire', specialty: 'Defense' },
    ]

    return (
      <AgentGrid
        agents={mockAgents}
        banList={[138652]} // 그레이스 밴
        pickList={selected ? [selected] : []}
        onSelect={(id) => setSelected(Number(id))}
        activeId={selected}
      />
    )
  }
}
