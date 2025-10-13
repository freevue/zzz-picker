import { DEFAULT_AGENT_COST_STATE } from '@/constant'
import { useSetting } from '@/hooks'
import type { Side, RoundSelectAgentState } from '@/types'
import { map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type PickState = {
  [key in Side]: [RoundSelectAgentState, RoundSelectAgentState, RoundSelectAgentState]
}
type PlayState = Map<string, PickState>

type Context = {
  pickList: Map<string, PickState>
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

  return <PlayContext.Provider value={{ pickList }}>{props.children}</PlayContext.Provider>
}

export default PlayProvider
