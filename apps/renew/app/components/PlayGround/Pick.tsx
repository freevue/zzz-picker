import type { PlayerRole } from '@/type'
import {
  filter,
  map,
  pipe,
  sort,
  toArray,
  join,
  concat,
  includes,
  uniq,
  isNumber,
  when,
  append,
  find,
  isNull,
} from '@fxts/core'
import { useMemo, useState } from 'react'
import { BroadcastEvent, MatchType, Phase, Role, SETTING } from '~/constant'
import { useMatchState, useStore } from '~/hooks'
import { updateProposeBan, updateSelectBan } from '~/lib/DB'
import { opponent } from '~/lib/utils'

const ROUND_LIST = [0, 1]
const Pick: React.FC = () => {
  const [round, setRound] = useState<keyof typeof ROUND_LIST>(ROUND_LIST[0])
  const store = useStore()
  const matchState = useMatchState()
  const bossData = useMemo(() => {
    const bossId = pipe(
      matchState.player!.role as PlayerRole,
      (role) => matchState.state.boss[role],
      (bossState) => bossState[round]
    )

    if (bossId === null) return null

    return pipe(
      store.deadlyAssault,
      find((boss) => boss.id === bossId)
    )!
  }, [matchState, store, round])

  const onRoundClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setRound(Number(event.currentTarget.value))
  }

  return (
    <div className="w-full h-full overflow-y-scroll pt-28 pb-14 px-4">
      <ul className="flex max-w-lg mx-auto rounded-full ft-ria overflow-hidden card h-12 text-lg">
        {pipe(
          ROUND_LIST,
          map((roundValue) => (
            <li className="flex-1" key={roundValue}>
              <button
                className={pipe(
                  ['w-full', 'h-full', 'cursor-pointer'],
                  concat(['active:outline-0', 'focus:outline-0']),
                  concat(round === roundValue ? ['bg-primary', 'text-accent'] : []),
                  join(' ')
                )}
                onClick={onRoundClick}
                value={roundValue}
                type="button"
              >
                {roundValue + 1} 라운드
              </button>
            </li>
          )),
          toArray
        )}
      </ul>
      <div className="max-w-lg mx-auto mt-4 flex gap-4">
        {isNull(bossData) ? (
          <button className="ft-ria cursor-pointer focus:outline-0 active:outline-0 text-6xl card size-48 flex items-center justify-center rounded-2xl">
            +
          </button>
        ) : (
          <>
            <button
              disabled={matchState.state.matchType !== MatchType.UNLIMITED}
              className="cursor-pointer card disabled:cursor-default focus:outline-0 active:outline-0 rounded-2xl size-48 overflow-hidden p-2 block"
            >
              <div className="w-full h-full overflow-hidden rounded-xl">
                <img
                  className="block w-full aspect-144/199 bg-ink"
                  src={bossData.src}
                  alt={bossData.nameKo}
                />
              </div>
            </button>
            <div className="pt-4 flex-1">
              <h2 className="ft-ria text-xl">{bossData!.nameKo}</h2>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Pick
