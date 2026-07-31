import { Dialog } from '..'
import { insertMatch, insertPlayer } from '@/lib/DB'
import { concat, join, map, pipe, toAsync, toArray, peek } from '@fxts/core'
import { useNavigate } from '@remix-run/react'
import { supabase } from '@zzz-picker/supabase'
import { MatchType, Role } from '~/constant'
import { TableName } from '~/lib/DB/constant'

type Props = {
  acvite: boolean
  onClose: () => void
}

const MATCH = [
  { value: MatchType.ORIGINAL, label: '정식 로프꾼' },
  { value: MatchType.LEGEND, label: '레전드 로프꾼' },
  { value: MatchType.UNLIMITED, label: '공허사냥꾼' },
]
const CreateRoom: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const onSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const { id: matchId } = await insertMatch(formData.get('match') as MatchType)
    await pipe(
      [Role.A_SIDE, Role.B_SIDE],
      map((role) => ({ role, name: formData.get(role) as string })),
      toAsync,
      peek(insertPlayer(matchId)),
      toArray
    )
    navigate(`/${matchId}`)
  }

  return (
    <Dialog
      active={props.acvite}
      className="flex items-center justify-center"
      onClose={props.onClose}
    >
      <form
        className="card rounded-2xl p-8 flex flex-col gap-4 w-screen max-w-xl"
        onSubmit={onSubmit}
      >
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
        <div className="bg-accent/80 h-14 rounded-xl">
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
