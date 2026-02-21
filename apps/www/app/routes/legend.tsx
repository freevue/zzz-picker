import { pipe, toArray, map, join, concat, split, filter } from '@fxts/core'
import { useSearchParams } from '@remix-run/react'
import { DEFAULT } from '@zzz-picker/constant'
import { Play, Setting } from '@zzz-picker/provider'
import { useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useEffect } from 'react'
import { AllowAgent, BanAgent, CostTable, CommonBossCard, Header, Playground } from '~/components'

const Legend: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { agents } = useStore()
  const options = useMemo(() => {
    return {
      totalCost: Infinity,
      banCount: Number(searchParams.get('banCount') || DEFAULT.BAN_COUNT),
      allowAgent: pipe(searchParams.get('allowAgent') || '', split(','), map(Number), toArray),
    }
  }, [searchParams])

  useEffect(() => {
    pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      join(','),
      (allowAgent) => {
        setSearchParams(
          (prev) => ({
            banCount: prev.get('banCount') || `${DEFAULT.BAN_COUNT}`,
            allowAgent: prev.get('allowAgent') || allowAgent,
          }),
          { replace: true }
        )
      }
    )
  }, [agents])

  return (
    <Setting option={options}>
      <div className="w-full h-full overflow-auto scrollbar-hidden">
        <Play>
          <div className="h-full ml-auto w-fit flex z-10 relative flex-1 overflow-auto scrollbar-hidden">
            <div
              className={pipe(
                [
                  'min-w-xl',
                  'w-xl',
                  'bg-content',
                  'flex',
                  'flex-col',
                  'gap-6',
                  'overflow-y-auto',
                  'overflow-x-hidden',
                  'scrollbar-hidden',
                ],
                concat(['bg-cover', 'bg-no-repeat', 'bg-[center_30px]']),
                concat([
                  'alice:bg-[url("https://images.zzz.freevue.dev/images/agents/156728/fde380b0-338d-4842-84e4-8527d2481c88.png")]',
                ]),
                join(' ')
              )}
            >
              <Header />
              <CommonBossCard />
              <div className="flex gap-6 flex-col">
                <AllowAgent />
                <BanAgent />
              </div>
              <CostTable />
            </div>
            <div
              className={pipe(
                [
                  'min-w-4xl',
                  'w-4xl',
                  'overflow-auto',
                  'scrollbar-hidden',
                  'min-h-screen',
                  'bg-base',
                ],
                join(' ')
              )}
            >
              <Playground />
            </div>
          </div>
        </Play>
      </div>
    </Setting>
  )
}

export default Legend
