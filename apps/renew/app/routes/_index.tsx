import { map, pipe, toArray, toAsync } from '@fxts/core'
import { useNavigate } from '@remix-run/react'
import { supabase } from '@zzz-picker/supabase'
import { Role } from '~/constant'
import { TableName } from '~/lib/DB/constant'

export default function Index() {
  const navigate = useNavigate()
  const onClick = async () => {
    const { id: matchId } = await pipe(
      supabase.from(TableName.MATCH),
      async (builder) => await builder.insert({}).select().single(),
      ({ data }) => data
    )

    await pipe(
      [Role.A_SIDE, Role.B_SIDE],
      toAsync,
      map((role) =>
        supabase
          .from(TableName.PLAY)
          .insert({
            matchId,
            role,
            name: 'Hello',
            agents: [null, null, null],
            engines: [null, null, null],
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
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-6">
      <div className="flex gap-20">
        <button
          onClick={onClick}
          className="w-60 card p-3 rounded-3xl cursor-pointer"
          type="button"
        >
          <img
            className="block w-full rounded-2xl"
            src="https://images.zzz.freevue.dev/images/logo/ef9ec605-5fe4-4728-901b-af4f8790958b.webp"
            alt="강습전"
          />
        </button>
        <button
          onClick={onClick}
          className="w-60 card p-3 rounded-3xl cursor-pointer"
          type="button"
        >
          <img
            className="block w-full rounded-2xl"
            src="https://images.zzz.freevue.dev/images/logo/ef9ec605-5fe4-4728-901b-af4f8790958b.webp"
            alt="강습전"
          />
        </button>
      </div>
    </div>
  )
}
