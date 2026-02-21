import { pipe, join, concat } from '@fxts/core'
import { Play, Setting } from '@zzz-picker/provider'
import { useState } from 'react'
import { CostTable, CommonBossCard, Header, Playground } from '~/components'

const YeShunguang = () => {
  const [show, setShow] = useState(true)

  const onWrapperClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    setShow((prev) => !prev)
  }

  return (
    <div
      onClick={onWrapperClick}
      className={pipe(
        ['alice:hidden', 'transition-opacity'],
        concat(show ? ['opacity-100'] : ['opacity-0']),
        join(' ')
      )}
    >
      <img
        className="block w-full"
        src="https://images.zzz.freevue.dev/images/agents/160762/193b9a7a-c6ff-4918-b0a7-02167a24642b.gif"
        alt=""
      />
    </div>
  )
}
const Unlimited: React.FC = () => {
  return (
    <Setting
      option={{
        banCount: 0,
        totalCost: Infinity,
        allowAgent: [],
      }}
    >
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
              <YeShunguang />
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

export default Unlimited
