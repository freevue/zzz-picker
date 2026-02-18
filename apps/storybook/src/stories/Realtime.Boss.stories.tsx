import { MOCK_BOSS_DATA } from '../mocks/bossData'
import { pipe, slice, sort, toArray } from '@fxts/core'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { BossSelector } from '@zzz-picker/components/realtime'
import type { Boss as BossType } from '@zzz-picker/constant'
import { useMemo } from 'react'

function shuffle(list: Pick<BossType, 'id' | 'nameKo'>[]) {
  return pipe(
    list,
    sort(() => Math.random() - 0.5),
    toArray
  )
}

const meta = {
  title: 'Realtime/Boss',
  component: BossSelector,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  args: {
    list: pipe(MOCK_BOSS_DATA, shuffle, slice(0, 3), toArray),
    active: 1,
  },
} satisfies Meta<typeof BossSelector>

export default meta

type Story = StoryObj<typeof meta>

export const Boss: Story = {
  render: (args) => {
    // const [value, setValue] = useState(args.value)

    return <BossSelector {...args} />
  },
}
