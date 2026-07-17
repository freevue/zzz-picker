import CardTitle from '../CardTitle'
import Pulse from '../Pulse'
import { isNull, isUndefined, pipe, when } from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'

const CommonBoss: React.FC = () => {
  const store = useStore()
  const matchState = useMatchState()
  const bossData = useMemo(() => {
    return pipe(
      matchState.select.commonBossSelect,
      when(isNull, () => matchState.state.boss[Role.B_SIDE][1]),
      (bossId) => store.deadlyAssault.get(bossId || '')
    )
  }, [matchState])

  return (
    <div className="card p-4 rounded-3xl relative">
      {matchState.phase === Phase.COMMON_BOSS_SELECT && <Pulse />}
      <CardTitle>Boss</CardTitle>
      <button className="size-44 card p-2 rounded-2xl text-8xl">
        {isUndefined(bossData) ? (
          '+'
        ) : (
          <div className="rounded-xl overflow-hidden w-full h-full">
            <img className="block w-full bg-ink" src={bossData.src} alt={bossData.nameKo} />
          </div>
        )}
      </button>
    </div>
  )
}

export default CommonBoss
