import List from './List'
import { Icon } from '@/components'
import { Role } from '~/constant'
import { useMatchState } from '~/hooks'

const Ban: React.FC = () => {
  const matchState = useMatchState()

  return (
    <div className="card p-4 rounded-3xl">
      <h2 className="ft-ria text-primary text-6xl mb-4">Ban</h2>
      <div className="flex">
        <List list={matchState.state.proposeBan[Role.A_SIDE]} />
        <Icon.Arrow className="rotate-180 block w-20" />
        <List list={matchState.state.selectBan[Role.B_SIDE]} />
      </div>
      <div className="flex mt-4">
        <List list={matchState.state.proposeBan[Role.B_SIDE]} />
        <Icon.Arrow className="rotate-180 block w-20" />
        <List list={matchState.state.selectBan[Role.A_SIDE]} />
      </div>
    </div>
  )
}

export default Ban
