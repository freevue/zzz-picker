import { Button } from '@/components/ui/button'
import { map, pipe, toArray, toAsync } from '@fxts/core'
import { Link } from '@remix-run/react'
import { supabase } from '@zzz-picker/supabase'
import { useRef } from 'react'

export default function Index() {
  const onClick = async () => {
    const { id: matchId } = await pipe(
      supabase.from('match'),
      async (builder) => await builder.insert({}).select().single(),
      ({ data }) => data
    )
    const [hSide, aSide, bSide] = await pipe(
      ['H', 'A', 'B'],
      toAsync,
      map((role) => supabase.from('play_user').insert({ role, matchId }).select().single()),
      map(({ data }) => data),
      toArray
    )
    const data = await pipe(
      [aSide, bSide],
      toAsync,
      map(({ id, role }) =>
        supabase.from('play').insert({ id, role, name: 'Hello' }).select().single()
      ),
      map(({ data }) => data),
      toArray
    )

    console.log(data)
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 p-6">
      <button onClick={onClick} className="text-2xl" type="button">
        Hello World
      </button>
    </div>
  )
}
