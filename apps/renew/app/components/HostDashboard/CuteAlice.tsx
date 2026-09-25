import { concat, filter, join, pipe, size } from '@fxts/core'
import { useMemo } from 'react'
import { useStore } from '~/hooks'

const URL =
  'https://images.zzz.freevue.dev/images/agents/156728/3edd3a9c-8886-4147-89b5-f2e3c01d7be7.webp'
const CuteAlice: React.FC = () => {
  const store = useStore()
  const list = useMemo(() => {
    return pipe(
      store.agents,
      filter(([, agent]) => agent.isAllow)
    )
  }, [store.agents])

  return (
    <img
      className={pipe(
        ['absolute left-1/2 -translate-x-1/2 scale-200 origin-top'],
        concat(size(list) === 0 ? ['top-[50%]'] : ['top-[78%]']),
        join(' ')
      )}
      src={URL}
      alt=""
    />
  )
}

export default CuteAlice
