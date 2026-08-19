import { pipe, sum, values } from '@fxts/core'
import { Link } from '@remix-run/react'
import { ExternalLink } from 'lucide-react'
import { Role } from '~/constant'
import { useMatch, useCost } from '~/hooks'

const PlayerName: React.FC = () => {
  const { play } = useMatch()
  const totalCost = useCost()

  /**
   * TODO: Cost 부분이 동적으로 바뀌면서, 가로 사이즈가 변동이 생김 (Cost 증감에 따라)
   * 해당 부분 리플로우 방지를 위해 가로 사이즈를 고정해야할듯?
   */

  return (
    <div className="card p-4 flex w-full justify-between items-center rounded-3xl">
      <div className="flex-center flex-1 gap-2">
        <Link
          to={`/room/${play[Role.A_SIDE].id}`}
          target="_blank"
          className="my-auto hover:text-primary"
        >
          <ExternalLink className="size-8" />
        </Link>
        <h3 className="ft-ria text-primary text-4xl">{play[Role.A_SIDE].name}</h3>
      </div>
      {pipe(totalCost[Role.A_SIDE], values, sum, (cost) => (
        <p className="ft-pre text-lg mt-4 flex items-end gap-1">
          [<span className="ft-ria text-2xl text-primary leading-tight tabular-nums">{cost}</span>
          <span className="ml-1 text-lg leading-tight font-black">Co.</span>]
        </p>
      ))}
      <span className="text-ink text-4xl ft-ria mx-2">VS</span>
      {pipe(totalCost[Role.B_SIDE], values, sum, (cost) => (
        <p className="ft-pre text-lg mt-4 flex items-end gap-1">
          [<span className="ft-ria text-2xl text-primary leading-tight tabular-nums">{cost}</span>
          <span className="ml-1 text-lg leading-tight font-black">Co.</span>]
        </p>
      ))}
      <div className="flex-center flex-1 gap-2">
        <h3 className="ft-ria text-primary text-4xl">{play[Role.B_SIDE].name}</h3>
        <Link
          to={`/room/${play[Role.B_SIDE].id}`}
          target="_blank"
          className="my-auto hover:text-primary"
        >
          <ExternalLink className="size-8" />
        </Link>
      </div>
    </div>
  )
}

export default PlayerName
