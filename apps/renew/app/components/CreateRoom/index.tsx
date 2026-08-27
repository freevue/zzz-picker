import { Dialog } from '..'
import { insertMatch, insertPlayer, selectAdversityBoss, selectValidAuthKey } from '@/lib/DB'
import { concat, join, map, pipe, toAsync, toArray, peek } from '@fxts/core'
import { useNavigate } from '@remix-run/react'
import { useEffect } from 'react'
import { BossType, MatchType, Phase, Role } from '~/constant'

type Props = {
  acvite: boolean
  onClose: () => void
}

const MATCH = [
  { value: MatchType.ORIGINAL, label: '정식 로프꾼' },
  { value: MatchType.LEGEND, label: '레전드 로프꾼' },
  { value: MatchType.UNLIMITED, label: '공허사냥꾼' },
]
const ROUNDS = [
  { value: BossType.TRIAL, label: '일반 모드' },
  { value: BossType.ADVERSITY, label: '절망 모드' },
]
const LOCAL_STORAGE_KEY = 'zzz-picker-auth'
const CreateRoom: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const round = formData.get('round') as BossType
    const { isApproval: isTest } = await pipe(
      window.localStorage.getItem(LOCAL_STORAGE_KEY) || '',
      selectValidAuthKey
    )

    const { id: matchId } = await pipe(
      formData.get('match') as MatchType,
      (matchType) => ({
        matchType: formData.get('match') as MatchType,
        phase:
          matchType === MatchType.UNLIMITED
            ? Phase.PICK
            : round === BossType.ADVERSITY
              ? Phase.BAN
              : Phase.COMMON_BOSS_SELECT,
      }),
      insertMatch
    )

    const { id: bossId } = await selectAdversityBoss()
    await pipe(
      [Role.A_SIDE, Role.B_SIDE],
      map((role) => ({
        role,
        name: formData.get(role) as string,
        boss: round === BossType.ADVERSITY ? [null, bossId] : [null, null],
      })),
      toAsync,
      peek(insertPlayer(matchId, !isTest)),
      toArray
    )
    navigate(`/${matchId}`)
  }

  return (
    <Dialog
      active={props.acvite}
      className="flex items-center justify-center"
      onClose={props.onClose}
      bgClose
    >
      <form
        className="card rounded-2xl p-8 flex flex-col gap-4 w-screen max-w-xl"
        onSubmit={onSubmit}
      >
        <div>
          <p className="text-3xl font-bold ft-pre mb-4">경기 타입</p>
          <ul className="flex rounded-full overflow-hidden h-12 w-full mb-4">
            {pipe(
              MATCH,
              map(({ value, label }) => (
                <li className="flex-1" key={value}>
                  <label
                    className={pipe(
                      [
                        'bg-accent',
                        'flex',
                        'items-center',
                        'justify-center',
                        'text-xl',
                        'ft-ria',
                        'px-4',
                        'cursor-pointer',
                        'h-full',
                      ],
                      concat(['active:outline-0', 'focus:outline-0']),
                      concat(['has-checked:bg-primary!', 'has-checked:text-accent!']),
                      join(' ')
                    )}
                  >
                    <p className="ft-pre font-bold text-2xl">{label}</p>
                    <input
                      className="appearance-none"
                      defaultChecked={MatchType.ORIGINAL === value}
                      type="radio"
                      name="match"
                      value={value}
                    />
                  </label>
                </li>
              )),
              toArray
            )}
          </ul>
        </div>
        <div>
          <p className="text-3xl font-bold ft-pre mb-4">2Round 타입</p>
          <ul className="flex rounded-full overflow-hidden h-12 w-full mb-4">
            {pipe(
              ROUNDS,
              map(({ value, label }) => (
                <li className="flex-1" key={value}>
                  <label
                    className={pipe(
                      [
                        'bg-accent',
                        'flex',
                        'items-center',
                        'justify-center',
                        'text-xl',
                        'ft-ria',
                        'px-4',
                        'cursor-pointer',
                        'h-full',
                      ],
                      concat(['active:outline-0', 'focus:outline-0']),
                      concat(['has-checked:bg-primary!', 'has-checked:text-accent!']),
                      join(' ')
                    )}
                  >
                    <p className="ft-pre font-bold text-2xl">{label}</p>
                    <input
                      className="appearance-none"
                      defaultChecked={BossType.TRIAL === value}
                      type="radio"
                      name="round"
                      value={value}
                    />
                  </label>
                </li>
              )),
              toArray
            )}
          </ul>
        </div>
        <div>
          <p className="text-3xl font-bold ft-pre mb-4">참가자</p>
          <div className="bg-accent/80 h-14 rounded-xl mb-2">
            <input
              type="text"
              className={pipe(
                ['h-full', 'text-2xl', 'ft-pre', 'font-black', 'px-4', 'block', 'w-full', 'h-full'],
                concat(['active:outline-0', 'focus:outline-0']),
                join(' ')
              )}
              name={Role.A_SIDE}
              placeholder="A 참가자 이름"
              autoComplete="off"
              required
            />
          </div>
          <div className="bg-accent h-14 rounded-xl">
            <input
              type="text"
              name={Role.B_SIDE}
              className={pipe(
                ['h-full', 'text-2xl', 'ft-pre', 'font-black', 'px-4', 'block', 'w-full', 'h-full'],
                concat(['active:outline-0', 'focus:outline-0']),
                join(' ')
              )}
              placeholder="B 참가자 이름"
              autoComplete="off"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className={pipe(
            [
              'h-14',
              'ft-pre',
              'font-black',
              'text-2xl',
              'px-4',
              'cursor-pointer',
              'bg-primary',
              'text-accent',
              'rounded-full',
              'mt-6',
            ],
            join(' ')
          )}
        >
          생성
        </button>
      </form>
    </Dialog>
  )
}

export default CreateRoom
