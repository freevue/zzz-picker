import { isUndefined, join, pipe } from '@fxts/core'
import { useMemo } from 'react'
import { useStore } from '~/hooks'

type Props = {
  bossId: string | null
}

const BossButton: React.FC<Props> = (props) => {
  const store = useStore()
  const boss = useMemo(() => {
    return store.deadlyAssault.get(props.bossId || '')
  }, [store, props.bossId])

  return (
    <button type="button" className={pipe(['rounded-2xl', 'size-20', 'bg-accent'], join(' '))}>
      {isUndefined(boss) ? (
        <></>
      ) : (
        <div className="rounded-xl w-full h-full overflow-hidden">
          <img className="w-full block bg-ink" src={boss.src} />
        </div>
      )}
    </button>
  )
}

export default BossButton
