import { isUndefined, pipe, sum, values } from '@fxts/core'
import { useMemo } from 'react'
import { useMatch, useCost } from '~/hooks'
import { PlayerRole } from '~/type'

const Cost: React.FC = () => {
  const { currentPlay } = useMatch()
  const cost = useCost()
  const totalCost = useMemo(() => {
    if (isUndefined(currentPlay)) return 0

    return pipe(cost[currentPlay.role as PlayerRole], values, sum)
  }, [cost, currentPlay])

  return (
    <div className="fixed bottom-0 right-0 left-0 p-4">
      <p className="ft-pre text-ink text-xl font-black rounded-full bg-accent h-14 w-full mx-auto max-w-lg text-center leading-15">
        <span className="ft-ria text-primary text-3xl mx-2">{totalCost}</span>
        <span>Co.</span>
      </p>
    </div>
  )
}

export default Cost
