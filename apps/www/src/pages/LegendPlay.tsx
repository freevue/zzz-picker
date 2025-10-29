import { Header, Playground, CostTable, CommonBossCard } from '@/components'
import { useRouter } from '@/hooks'
import { pipe, concat, join, map, toArray, split } from '@fxts/core'
import { DEFAULT } from '@zzz-picker/constant'
import { Play, Setting } from '@zzz-picker/provider'
import { useMemo } from 'react'

const CustomPlay: React.FC = () => {
  const { searchParams } = useRouter()
  const options = useMemo(() => {
    return {
      banCount: Number(searchParams.banCount || DEFAULT.BAN_COUNT),
      totalCost: Infinity,
      allowAgent: pipe(searchParams.allowAgent || '', split(','), map(Number), toArray),
    }
  }, [searchParams])

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
                  'text-white',
                  'bg-content',
                  'flex',
                  'flex-col',
                  'gap-6',
                  'overflow-y-auto',
                  'overflow-x-hidden',
                  'scrollbar-hidden',
                ],
                concat(['bg-cover', 'bg-no-repeat', 'bg-[180px_30px]']),
                concat([
                  'alice:bg-[url("https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2025/08/04/01f84d7fdcdbef65d8a9c94416e81d91_2128704813195499621.png?x-oss-process=image%2Fformat%2Cwebp")]',
                ]),
                join(' ')
              )}
            >
              <Header />
              <CommonBossCard />
              <CostTable />
            </div>
            <div
              className={pipe(
                [
                  'min-w-4xl',
                  'bg-base',
                  'w-4xl',
                  'overflow-auto',
                  'scrollbar-hidden',
                  'min-h-screen',
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

export default CustomPlay
