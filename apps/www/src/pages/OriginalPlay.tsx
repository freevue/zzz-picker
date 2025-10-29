import { Header, Playground, CostTable, Boss } from '@/components'
import { useStore } from '@/hooks'
import { pipe, toArray, filter, map } from '@fxts/core'
import { DEFAULT } from '@zzz-picker/constant'
import { Play, Setting } from '@zzz-picker/provider'
import { useMemo } from 'react'

const OriginalPlay: React.FC = () => {
  const { gqlAgents } = useStore()
  const options = useMemo(() => {
    if (gqlAgents.size === 0)
      return {
        banCount: DEFAULT.BAN_COUNT,
        totalCost: DEFAULT.TOTAL_COST,
        allowAgent: [],
      }

    return pipe(
      gqlAgents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => Number(id)),
      toArray,
      (allowAgent) => ({
        banCount: DEFAULT.BAN_COUNT,
        totalCost: DEFAULT.TOTAL_COST,
        allowAgent,
      })
    )
  }, [gqlAgents])

  return (
    <Setting option={options}>
      <div className="w-full h-full overflow-auto scrollbar-hidden">
        <Play>
          <div className="h-full ml-auto w-fit flex z-10 relative flex-1 overflow-auto scrollbar-hidden">
            <div className="min-w-xl w-xl dark:text-white bg-content flex flex-col gap-6 overflow-y-auto overflow-x-hidden scrollbar-hidden">
              <Header />
              <Boss />
              <CostTable />
            </div>
            <div className="min-w-4xl w-4xl overflow-auto scrollbar-hidden min-h-screen">
              <Playground />
            </div>
          </div>
        </Play>
      </div>
    </Setting>
  )
}

export default OriginalPlay
