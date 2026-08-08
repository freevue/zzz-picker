import { Link } from '@remix-run/react'
import { ExternalLink } from 'lucide-react'
import { Role } from '~/constant'
import { useMatch } from '~/hooks'

const PlayerName: React.FC = () => {
  const { play } = useMatch()

  return (
    <div className="card p-4 flex w-full justify-between items-end rounded-3xl">
      <h3 className="ft-ria text-primary text-4xl flex-1 text-center">{play[Role.A_SIDE].name}</h3>
      <Link
        to={`/room/${play[Role.A_SIDE].id}`}
        target="_blank"
        className="my-auto hover:text-primary"
      >
        <ExternalLink className=" size-8" />
      </Link>
      <span className="text-ink text-4xl ft-ria mx-8">VS</span>
      <Link
        to={`/room/${play[Role.B_SIDE].id}`}
        target="_blank"
        className="my-auto hover:text-primary"
      >
        <ExternalLink className=" size-8" />
      </Link>
      <h3 className="ft-ria text-primary text-4xl flex-1 text-center">{play[Role.B_SIDE].name}</h3>
    </div>
  )
}

export default PlayerName
