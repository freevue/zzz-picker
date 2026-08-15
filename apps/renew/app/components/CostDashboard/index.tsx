import AgentCostTable from './Agent'
import EngineCostTable from './Engine'

const CostDashboard = () => {
  return (
    <div className="h-dvh w-dvw max-w-2xl mx-auto p-4 overflow-hidden flex gap-4 flex-col">
      <div className="flex-1 flex w-full flex-col overflow-hidden gap-2">
        <h2 className="ft-ria text-primary text-2xl">에이전트</h2>
        <AgentCostTable />
      </div>
      <div className="flex-1 flex w-full flex-col overflow-hidden gap-2">
        <h2 className="ft-ria text-primary text-2xl">W-엔진</h2>
        <EngineCostTable />
      </div>
    </div>
  )
}

export default CostDashboard
