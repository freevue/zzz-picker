import { isUndefined, pipe } from '@fxts/core'
import { useMemo } from 'react'
import { Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'

const CommonBoss: React.FC = () => {
  const store = useStore()
  const matchState = useMatchState()
  const bossData = useMemo(() => {
    return pipe(
      matchState.state.boss[Role.B_SIDE],
      (list) => list[1],
      (bossId) => store.deadlyAssault.get(bossId || '')
    )
  }, [matchState])

  return (
    <div className="card p-4 rounded-3xl">
      <h2 className="ft-ria text-primary text-6xl mb-4">Boss</h2>
      {isUndefined(bossData) ? (
        <></>
      ) : (
        <div className="size-50 card p-2 rounded-2xl">
          <div className="rounded-xl overflow-hidden w-full h-full">
            <img className="block w-full bg-ink" src={bossData.src} alt={bossData.nameKo} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CommonBoss
