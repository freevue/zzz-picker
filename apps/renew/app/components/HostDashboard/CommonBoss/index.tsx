import CardTitle from '../CardTitle'
import { isNull, isUndefined, pipe, when } from '@fxts/core'
import { useMemo } from 'react'
import { Icon } from '~/components'
import { Phase, Role } from '~/constant'
import { useMatch, useStore } from '~/hooks'

const CommonBoss: React.FC = () => {
  const store = useStore()
  const { play, select, match } = useMatch()
  const bossData = useMemo(() => {
    return pipe(
      select[Phase.COMMON_BOSS_SELECT],
      when(isNull, () => play[Role.B_SIDE].boss[1]),
      (bossId) => store.deadlyAssault.get(bossId || '')
    )
  }, [play, select])

  return (
    <div className="">
      <CardTitle active={match.phase === Phase.COMMON_BOSS_SELECT}>Boss</CardTitle>
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
