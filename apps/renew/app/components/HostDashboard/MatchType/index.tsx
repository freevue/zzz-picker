import CardTitle from '../CardTitle'
import { updateMatchType } from '@/lib/DB'
import { concat, join, map, pipe, toArray } from '@fxts/core'
import { BroadcastEvent, MatchType } from '~/constant'
import { useMatch } from '~/hooks'

const MATCH_LIST = [
  { label: '정식 로프꾼', value: MatchType.ORIGINAL },
  { label: '레전드 로프꾼', value: MatchType.LEGEND },
  { label: '공허사냥꾼', value: MatchType.UNLIMITED },
]
const CommonBoss: React.FC = () => {
  const { match, send } = useMatch()

  const onMatchTypeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    send(
      BroadcastEvent.MATCH_TYPE,
      await pipe(event.currentTarget.value as MatchType, updateMatchType(match.matchId))
    )
  }

  return (
    <div className="card p-4 rounded-3xl">
      <CardTitle>Match</CardTitle>
      <ul className="flex rounded-full overflow-hidden h-12">
        {pipe(
          MATCH_LIST,
          map(({ value, label }) => (
            <li key={value} className="bg-accent flex-1">
              <button
                type="button"
                value={value}
                disabled={match.matchType === value}
                onClick={onMatchTypeClick}
                className={pipe(
                  ['block', 'w-full', 'h-full', 'font-bold', 'ft-pre', 'text-xl', 'cursor-pointer'],
                  concat(match.matchType === value ? ['bg-primary', 'text-accent'] : []),
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
