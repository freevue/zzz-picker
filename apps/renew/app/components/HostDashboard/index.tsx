import Ban from './Ban'
import CommonBoss from './CommonBoss'
import PlayerName from './PlayerName'
import Round from './Round'
import SpecialRule from './SpecialRule'

const HostDashboard: React.FC = () => {
  return (
    <div className="flex w-full h-full gap-4 p-4">
      <div className="flex-1 max-w-xl">
        <SpecialRule />
      </div>
      <div className="flex-1 flex flex-col gap-4 max-w-lg min-w-lg">
        <CommonBoss />
        <Ban />
      </div>
      <div className="flex-1 flex flex-col gap-4">
        <PlayerName />
        <Round round={0} />
        <Round round={1} />
      </div>
    </div>
  )
}

export default HostDashboard
