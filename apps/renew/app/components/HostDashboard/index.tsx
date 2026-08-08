import AllowAgent from './AllowAgent'
import Ban from './Ban'
import CommonBoss from './CommonBoss'
import MatchType from './MatchType'
import PlayerName from './PlayerName'
import Result from './Result'
import Round from './Round'
import SpecialRule from './SpecialRule'
import UnlimitedCard from './UnlimitedCard'
import { MatchType as MatchTypeEnum } from '@/constant'
import { concat, pipe, join } from '@fxts/core'
import { Link } from '@remix-run/react'
import { ArrowLeft, Info, ChevronsRight } from 'lucide-react'
import { useState } from 'react'
import { useMatch } from '~/hooks'

const HostDashboard: React.FC = () => {
  const { match } = useMatch()
  const [isResult, setIsResult] = useState<boolean>(false)

  const onResultClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setIsResult((prev) => !prev)
  }

  return (
    <div className="flex w-full h-full gap-4 px-4">
      <div className="flex-1 max-w-sm min-w-sm py-4">
        <ul className="flex mb-4 gap-4">
          <li>
            <Link to="/" className="size-10 rounded-full flex-center bg-primary text-accent">
              <ArrowLeft />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="size-10 rounded-full flex-center bg-primary text-accent"
            >
              <Info />
            </button>
          </li>
        </ul>
        <SpecialRule />
      </div>
      <div className="flex-1 flex flex-col gap-4 py-4 max-w-sm min-w-sm overflow-auto scrollbar-hidden">
        <MatchType />
        <div className="card p-4 gap-8 rounded-3xl flex-1 flex flex-col relative overflow-hidden">
          <CommonBoss />
          <AllowAgent />
          <Ban />
          {match.matchType === MatchTypeEnum.UNLIMITED && <UnlimitedCard />}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-4 min-w-xl py-4">
        <PlayerName />
        <div className="flex flex-1 relative @container">
          <div
            className={pipe(
              ['flex flex-1 flex-col gap-4', 'transition-opacity'],
              concat(isResult ? ['opacity-0'] : ['opacity-100']),
              join(' ')
            )}
          >
            <Round round={0} />
            <Round round={1} />
          </div>
          <div
            className={pipe(
              ['absolute inset-0 -z-1', 'transition-opacity'],
              concat(isResult ? ['opacity-100'] : ['opacity-0']),
              join(' ')
            )}
          >
            <Result />
          </div>
          <button
            type="button"
            className={pipe(
              [
                'cursor-pointer',
                'bg-primary',
                'absolute',
                'top-1/2',
                'left-0',
                '-translate-y-1/2',
                'rounded-2xl',
                'transition-transform',
                'duration-300',
                'overflow-hidden',
              ],
              concat(isResult ? ['translate-x-4'] : ['translate-x-[calc(100cqw-100%-1rem)]']),
              join(' ')
            )}
            onClick={onResultClick}
          >
            <div
              className={pipe(
                [
                  'flex',
                  'text-2xl',
                  'ft-pre',
                  'font-black',
                  'px-4',
                  'py-2',
                  'text-accent',
                  'items-center',
                  'transition-transform',
                ],
                concat(isResult ? ['rotate-0'] : ['rotate-180']),
                join(' ')
              )}
            >
              <span
                className={pipe(
                  ['transition-transform'],
                  concat(isResult ? ['rotate-0'] : ['rotate-180']),
                  join(' ')
                )}
              >
                {isResult ? '파티보기' : '결산하기'}
              </span>
              <ChevronsRight className="size-8" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostDashboard
