import { Context as SettingContext } from './Setting'
import { Context as StoreContext } from './Store'
import { findIndex, map, pipe, range, toArray, zipWithIndex } from '@fxts/core'
import {
  PRETTY_AGENT_ID,
  DEFAULT,
  type SelectAgent,
  type SelectBoss,
  type RoundSide,
} from '@zzz-picker/constant'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

const ALICE_AUDIO_PATH = '/audio/alice.mp3'

export type TypeEngine = 'SExclusive' | 'S' | 'A' | null
export type Side = 'A' | 'B'
export type Score = {
  timer: number
  score: number
}
export type TypePick = {
  agent: SelectAgent
  setting: {
    rate: number
    engineType: TypeEngine
    engineRate: number
  }
}
export type SideByRound = {
  result: Score
  pickList: [TypePick, TypePick, TypePick]
}
export type TypeRound = {
  name: string
  A: SideByRound
  B: SideByRound
  boss: SelectBoss
}

const DEFAULT_SCORE: Score = {
  timer: 0,
  score: 0,
}
const DEFAULT_SETTING: TypePick['setting'] = {
  rate: 0,
  engineType: null,
  engineRate: 0,
}
const DEFAULT_PICK: TypePick = {
  agent: null,
  setting: DEFAULT_SETTING,
}
const DEFAULT_SIDE: SideByRound = {
  result: DEFAULT_SCORE,
  pickList: [DEFAULT_PICK, DEFAULT_PICK, DEFAULT_PICK],
}
const DEFAULT_ROUND: TypeRound = {
  name: '',
  A: DEFAULT_SIDE,
  B: DEFAULT_SIDE,
  boss: null as SelectBoss,
}

type PlayState = {
  banList: Array<SelectAgent>
  common: {
    title: string
    boss: SelectBoss
  } & Record<Side, RoundSide>
  persnal: {
    title: string
  } & Record<Side, RoundSide & { boss: SelectBoss }>
}

type Props = {
  children: React.ReactNode
}
type State = {
  state: PlayState
  setState: React.Dispatch<React.SetStateAction<PlayState>>
  reset: () => void

  banList: Array<SelectAgent>
  round: Map<number, TypeRound>
  isCounting: boolean
  setIsCounting: () => void
  setBan: (index: number, id: SelectAgent) => void
  setRoundBossSelect: (roundIndex: number, bossIndex: SelectBoss) => void
  setRoundPick: (roundIndex: number, side: Side, index: number, agent: SelectAgent) => void
  setRoundResultScore: (roundIndex: number, side: Side, score: number) => void
  setRoundResultTime: (roundIndex: number, side: Side, time: number) => void
  setRoundCostSetting: (
    roundIndex: number,
    side: Side,
    index: number,
    setting: TypePick['setting']
  ) => void
}

const DEFAULT_STATE = {
  banList: [],
  common: {
    title: '공용 무대',
    boss: null,
    A: DEFAULT.ROUNDE_SIDE,
    B: DEFAULT.ROUNDE_SIDE,
  },
  persnal: {
    title: '개인 무대',
    A: { ...DEFAULT.ROUNDE_SIDE, boss: null },
    B: { ...DEFAULT.ROUNDE_SIDE, boss: null },
  },
}

export const Context = createContext<State>({
  state: DEFAULT_STATE,
  setState: () => {},
  reset: () => {},

  banList: [],
  isCounting: false,
  round: new Map(),
  setIsCounting: () => {},
  setBan: () => {},
  setRoundBossSelect: () => {},
  setRoundPick: () => {},
  setRoundResultScore: () => {},
  setRoundResultTime: () => {},
  setRoundCostSetting: () => {},
})

const Provider = (props: Props) => {
  const [state, setState] = useState<PlayState>(DEFAULT_STATE)
  const { state: settingState, setting, roundList } = useContext(SettingContext)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  useEffect(() => {
    pipe(
      settingState.banCount,
      range,
      map(() => null),
      toArray,
      (banList) => setState((prev) => ({ ...prev, banList }))
    )
  }, [settingState.banCount])
  useEffect(() => {
    setIsCounting(false)
  }, [state])

  const { gqlAgents } = useContext(StoreContext)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [banList, setBanList] = useState<Array<SelectAgent>>([])
  const [round, setRound] = useState<Map<number, TypeRound>>(new Map())

  useEffect(() => {
    pipe(
      setting.banCount,
      range,
      map(() => null),
      toArray,
      (list) => setBanList(list)
    )
  }, [setting.banCount])
  useEffect(() => {
    const history = JSON.parse(window.localStorage.getItem('zzz-picker-round') || '[]')

    pipe(
      roundList,
      zipWithIndex,
      map(([index, name]) => [index, { ...DEFAULT_ROUND, name, ...history[index] }] as const),
      toArray,
      (list) => {
        setRound(new Map(list))
      }
    )
  }, [roundList, gqlAgents])
  useEffect(() => {
    pipe(
      [...round.entries()],
      map(([, round]) => round),
      toArray,
      (list) => {
        window.localStorage.setItem('zzz-picker-round', JSON.stringify(list))
      }
    )
  }, [round])

  return (
    <Context.Provider
      value={{
        state,
        setState,
        reset: () => {
          setState(DEFAULT_STATE)
        },

        banList,
        round,
        isCounting,
        setBan: (index, id) => {
          setBanList((prev) => {
            const newList = [...prev]
            newList[index] = id

            return newList
          })
        },
        setRoundBossSelect: (roundIndex, boss) => {
          setRound((prev) => {
            const newRound = new Map(prev)

            newRound.set(roundIndex, { ...prev.get(roundIndex)!, boss })

            return newRound
          })
        },
        setRoundPick: (roundIndex, side, index, agent) => {
          const currentRound = round.get(roundIndex)!

          if (agent === PRETTY_AGENT_ID && audioRef.current === null) {
            const onAudioLoadedMetaData = () => {
              audioRef.current?.play()
            }
            const onAudioEnded = () => {
              audioRef.current?.removeEventListener('loadedmetadata', onAudioLoadedMetaData)
              audioRef.current?.removeEventListener('ended', onAudioEnded)
            }

            audioRef.current = new Audio(ALICE_AUDIO_PATH)

            audioRef.current.volume = 0.5
            audioRef.current.addEventListener('ended', onAudioEnded)
            audioRef.current.addEventListener('loadedmetadata', onAudioLoadedMetaData)
          }

          pipe(
            currentRound,
            (round) => [...round[side].pickList],
            (pickList) => {
              const currentIndex = pipe(
                pickList,
                findIndex((pick) => pick.agent === agent)
              )

              if (currentIndex === -1) {
                pickList[index] = { agent, setting: DEFAULT_PICK.setting }
              } else {
                pickList[index] = pickList[currentIndex]
                pickList[currentIndex] = { agent: null, setting: DEFAULT_PICK.setting }
              }

              return pickList
            },
            (pickList) => {
              const newRound = new Map(round)

              newRound.set(roundIndex, {
                ...currentRound!,
                [side]: { ...currentRound![side], pickList },
              })

              return newRound
            },
            (round) => {
              setRound(round)
            }
          )
        },
        setRoundResultScore: (roundIndex, side, score) => {
          setRound((prev) => {
            const newRound = new Map(prev)

            newRound.set(roundIndex, {
              ...prev.get(roundIndex)!,
              [side]: {
                ...prev.get(roundIndex)![side],
                result: { ...prev.get(roundIndex)![side].result, score },
              },
            })

            return newRound
          })
        },
        setRoundResultTime: (roundIndex, side, timer) => {
          setRound((prev) => {
            const newRound = new Map(prev)

            newRound.set(roundIndex, {
              ...prev.get(roundIndex)!,
              [side]: {
                ...prev.get(roundIndex)![side],
                result: { ...prev.get(roundIndex)![side].result, timer },
              },
            })

            return newRound
          })
        },
        setRoundCostSetting: (roundIndex, side, index, setting) => {
          const currentRound = round.get(roundIndex)!

          pipe(
            currentRound,
            (round) => [...round[side].pickList],
            (pickList) => {
              pickList[index] = { ...pickList[index], setting }

              return pickList
            },
            (pickList) => {
              const newRound = new Map(round)

              newRound.set(roundIndex, {
                ...currentRound!,
                [side]: { ...currentRound![side], pickList },
              })

              return newRound
            },
            (round) => {
              setRound(round)
            }
          )
        },
        setIsCounting: () => {
          setIsCounting((prev) => !prev)
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
