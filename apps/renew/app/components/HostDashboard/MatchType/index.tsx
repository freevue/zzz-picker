import CardTitle from '../CardTitle'
import { concat, entries, isUndefined, join, map, pipe, toArray } from '@fxts/core'
import { useMemo } from 'react'
import { MatchType, Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'

const MATCH_LIST = [
  { label: '정식 로프꾼', value: MatchType.ORIGINAL },
  { label: '레전드 로프꾼', value: MatchType.LEGEND },
  { label: '공허사냥꾼', value: MatchType.UNLIMITED },
]
const CommonBoss: React.FC = () => {
  const matchState = useMatchState()

  return (
    <div className="card p-4 rounded-3xl">
      <CardTitle>Match</CardTitle>
      <ul className="flex flex-col gap-4">
        {pipe(
          MATCH_LIST,
          map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                value={value}
                disabled={matchState.state.matchType === value}
                className={pipe(
                  ['rounded-full', 'block', 'w-full', 'h-12', 'ft-ria', 'text-lg'],
                  concat(['focus:outline-0', 'active:outline-0']),
                  concat(
                    matchState.state.matchType === value ? ['bg-primary', 'text-accent'] : ['card']
                  ),
                  join(' ')
                )}
              >
                {label}
              </button>
            </li>
          )),
          toArray
        )}
        <li></li>
      </ul>
    </div>
  )
}

export default CommonBoss
