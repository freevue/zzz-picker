import { Role } from '@/constant'
import type { Player, PlayerRole } from '@/type'
import { pipe, zip, map, toArray } from '@fxts/core'
import { createContext, useState } from 'react'
import { useMatch } from '~/hooks'

const INITIAL_STATE = {
  score: [
    { [Role.A_SIDE]: 0, [Role.B_SIDE]: 0 },
    { [Role.A_SIDE]: 0, [Role.B_SIDE]: 0 },
  ] as Array<Record<PlayerRole, number>>,
  time: [
    { [Role.A_SIDE]: 0, [Role.B_SIDE]: 0 },
    { [Role.A_SIDE]: 0, [Role.B_SIDE]: 0 },
  ] as Array<Record<PlayerRole, number>>,
}

type Props = {
  children: React.ReactNode
}

type State = {
  score: Array<Record<PlayerRole, number>>
  time: Array<Record<PlayerRole, number>>
  setState: React.Dispatch<React.SetStateAction<typeof INITIAL_STATE>>
}

export const Context = createContext<State>({ ...INITIAL_STATE, setState: () => {} })

const ScoreState: React.FC<Props> = (props) => {
  const { play } = useMatch()
  const [state, setState] = useState<typeof INITIAL_STATE>({
    score: pipe(
      props.match.B.score,
      zip(props.match.A.score),
      map(([A, B]) => ({ A, B })),
      toArray
    ) as Array<Record<PlayerRole, number>>,
    time: pipe(
      props.match.B.time,
      zip(props.match.A.time),
      map(([A, B]) => ({ A, B })),
      toArray
    ) as Array<Record<PlayerRole, number>>,
  })

  return <Context.Provider value={{ ...state, setState }}>{props.children}</Context.Provider>
}

export default ScoreState
