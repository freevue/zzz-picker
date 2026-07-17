import { Role } from '~/constant'
import { useMatchState } from '~/hooks'

const PlayerName: React.FC = () => {
  const matchState = useMatchState()

  return (
    <div className="card p-4 flex w-full justify-between items-end rounded-3xl">
      <h3 className="ft-ria text-primary text-4xl flex-1 text-center">
        {matchState.state.name[Role.A_SIDE]}
      </h3>
      <span className="text-ink text-4xl ft-ria">VS</span>
      <h3 className="ft-ria text-primary text-4xl flex-1 text-center">
        {matchState.state.name[Role.B_SIDE]}
      </h3>
    </div>
  )
}

export default PlayerName
