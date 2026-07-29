import { Icon } from '..'
import AllowAgent from './AllowAgent'
import Ban from './Ban'
import CommonBoss from './CommonBoss'
import MatchType from './MatchType'
import PlayerName from './PlayerName'
import Round from './Round'
import SpecialRule from './SpecialRule'

const HostDashboard: React.FC = () => {
  return (
    <div className="flex w-full h-full gap-4 px-4">
      <div className="flex-1 max-w-sm min-w-sm py-4">
        <SpecialRule />
      </div>
      <div className="flex-1 flex flex-col gap-4 py-4 max-w-sm min-w-sm overflow-auto scrollbar-hidden">
        <MatchType />
        <div className="card p-4 gap-8 rounded-3xl flex-1 flex flex-col">
          <CommonBoss />
          <AllowAgent />
          <Ban />
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 min-w-xl py-4">
        <PlayerName />
        <div className="flex flex-1 flex-col gap-4">
          <Round round={0} />
          <Round round={1} />
        </div>
        <button className="mx-auto size-14 rounded-full bg-primary flex items-center justify-center">
          <Icon.Arrow className="-rotate-90 size-10" />
        </button>
      </div>
    </div>
  )
}

export default HostDashboard
