import { DEFAULT_AGENT_COST_STATE } from '@/constant'
import { useSetting } from '@/hooks'
import type { Side, SelectAgent, AgentCostSetting, PlayState, PickState } from '@/types'
import { findIndex, map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Context = {
  pickList: Map<string, PickState>
  onSelect: (round: string, side: Side, index: number, agent: SelectAgent) => void
  onSetting: (round: string, side: Side, index: number, setting: AgentCostSetting) => void
}

const DEFAULT_PICK_STATE: PickState = {
  A: [
    { id: null, setting: DEFAULT_AGENT_COST_STATE },
    { id: null, setting: DEFAULT_AGENT_COST_STATE },
    { id: null, setting: DEFAULT_AGENT_COST_STATE },
  ],
  B: [
    { id: null, setting: DEFAULT_AGENT_COST_STATE },
    { id: null, setting: DEFAULT_AGENT_COST_STATE },
    { id: null, setting: DEFAULT_AGENT_COST_STATE },
  ],
}

export const PlayContext = createContext<Context>({
  pickList: new Map(),
  onSelect: () => {},
  onSetting: () => {},
})

type Props = {
  children: React.ReactNode
}

const PlayProvider: React.FC<Props> = (props) => {
  const { roundList } = useSetting()
  const [pickList, setPickList] = useState<PlayState>(new Map())

  useEffect(() => {
    pipe(
      roundList,
      map((round) => [round, DEFAULT_PICK_STATE] as const),
      toArray,
      (list) => setPickList(new Map(list))
    )
  }, [roundList])

  return (
    <PlayContext.Provider
      value={{
        pickList,
        onSetting: (round, side, index, setting) => {
          pipe(
            pickList.get(round)!,
            (data) => [...data[side]],
            (list) => {
              list[index] = { ...list[index], setting }

              return list
            },
            (list) => {
              setPickList((prev) => {
                const data = new Map(prev)

                data.set(round, { ...data.get(round)!, [side]: list })

                return data
              })
            }
          )
        },
        onSelect: (round, side, index, agent) => {
          pipe(
            pickList.get(round)!,
            (data) => [...data[side]],
            (list) => {
              const prevIndex = findIndex(({ id }) => id === agent, list)

              if (prevIndex !== -1) {
                list[prevIndex] = { id: null, setting: DEFAULT_AGENT_COST_STATE }
                list[index] = { id: agent, setting: list[prevIndex].setting }
              } else {
                list[index] = { id: agent, setting: DEFAULT_AGENT_COST_STATE }
              }

              return list
            },
            (list) => {
              setPickList((prev) => {
                const data = new Map(prev)

                data.set(round, { ...data.get(round)!, [side]: list })

                return data
              })
            }
          )
        },
      }}
    >
      {props.children}
    </PlayContext.Provider>
  )
}

export default PlayProvider
