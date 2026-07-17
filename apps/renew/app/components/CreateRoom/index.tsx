import { Dialog } from '..'
import { concat, join, map, pipe, toAsync, toArray } from '@fxts/core'
import { useNavigate } from '@remix-run/react'
import { supabase } from '@zzz-picker/supabase'
import { MatchType, Role } from '~/constant'
import { TableName } from '~/lib/DB/constant'

type Props = {
  acvite: boolean
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
    const { id: matchId } = await pipe(
      supabase.from(TableName.MATCH),
      async (builder) =>
        await builder
          .insert({ matchType: formData.get('match') })
          .select()
          .single(),
      ({ data }) => data
    )
    await pipe(
      [Role.A_SIDE, Role.B_SIDE],
      map((role) => ({ role, name: formData.get(role) })),
      toAsync,
      map(({ role, name }) =>
        supabase
          .from(TableName.PLAY)
          .insert({
            matchId,
            role,
            name,
            agent: {
              0: [null, null, null],
              1: [null, null, null],
            },
            engine: {
              0: [null, null, null],
              1: [null, null, null],
            },
            boss: [null, null],
            proposeBan: [null, null],
            selectBan: [null],
          })
          .select()
          .single()
      ),
      map(({ data }) => data),
      toArray
    )
    navigate(`/${matchId}`)
  }

  return (
    <Dialog active={props.acvite} className="flex items-center justify-center">
      <form className="card rounded-2xl p-4 flex flex-col gap-4" onSubmit={onSubmit}>
        <ul className="flex rounded-full overflow-hidden h-10">
          {pipe(
            MATCH,
            map(({ value, label }) => (
              <li key={value}>
                <label
                  className={pipe(
                    [
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-xl',
                      'ft-ria',
                      'px-4',
                      'cursor-pointer',
                      'h-full',
                      'card',
                    ],
                    concat(['active:outline-0', 'focus:outline-0']),
                    concat(['has-checked:bg-primary!', 'has-checked:text-accent!']),
                    join(' ')
                  )}
                >
                  <p>{label}</p>
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
        <div className="bg-accent/80 h-12 rounded-xl">
          <input
            type="text"
            className={pipe(
              ['h-10', 'text-xl', 'ft-ria', 'px-4', 'block', 'w-full', 'h-full'],
              concat(['active:outline-0', 'focus:outline-0']),
              join(' ')
            )}
            name={Role.A_SIDE}
            placeholder="A 참가자 이름"
          />
        </div>
        <div className="bg-accent/80 h-12 rounded-xl">
          <input
            type="text"
            name={Role.B_SIDE}
            className={pipe(
              ['h-10', 'text-xl', 'ft-ria', 'px-4', 'block', 'w-full', 'h-full'],
              concat(['active:outline-0', 'focus:outline-0']),
              join(' ')
            )}
            placeholder="B 참가자 이름"
          />
        </div>
        <button
          type="submit"
          className={pipe(
            [
              'h-10',
              'text-xl',
              'ft-ria',
              'px-4',
              'cursor-pointer',
              'bg-primary',
              'text-accent',
              'rounded-full',
              'mt-6',
            ],
            concat(['active:outline-0', 'focus:outline-0']),
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
