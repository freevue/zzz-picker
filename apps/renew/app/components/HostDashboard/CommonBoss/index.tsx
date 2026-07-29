import CardTitle from '../CardTitle'
import { isNull, isUndefined, pipe, when } from '@fxts/core'
import { useMemo } from 'react'
import { Icon } from '~/components'
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
    <div className="">
      <CardTitle active={matchState.phase === Phase.COMMON_BOSS_SELECT}>Boss</CardTitle>
      <button className="size-44 bg-accent rounded-2xl overflow-hidden relative">
        {isUndefined(bossData) ? (
          <Icon.Plus className="size-32 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <div className="w-full h-full">
            <img
              className="block w-full bg-accent-foreground"
              src={bossData.src}
              alt={bossData.nameKo}
            />
          </div>
        )}
      </button>
    </div>
  )
}

export default CommonBoss
