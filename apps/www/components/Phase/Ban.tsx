import type { Rols, RealtimeState } from '.'
import {
  pipe,
  filter,
  map,
  toArray,
  concat,
  join,
  includes,
  isNull,
  head,
  isUndefined,
  zipWithIndex,
} from '@fxts/core'
import { Typo, Form } from '@zzz-picker/components/v2'
import { SOCKET_EVENT, type SelectAgent } from '@zzz-picker/constant'
import { useSocket, useStore } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

type Props = {
  role: Rols
  state: RealtimeState
}

const Ban: React.FC<Props> = (props) => {
  const [value, setValue] = useState<[SelectAgent, SelectAgent]>([null, null])
  const { agents } = useStore()
  const { send } = useSocket(
    ({ banList }) => {
      setValue(banList as [SelectAgent, SelectAgent])
    },
    { event: [SOCKET_EVENT.BAN] }
  )
  const disabledAgents = useMemo(() => {
    const selectAgent = pipe(
      value,
      filter((agent) => !isNull(agent)),
      head
    )

    if (isUndefined(selectAgent)) return []

    console.log(agents.get(selectAgent))

    return pipe(
      agents,
      filter(([, agent]) => !agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents, value])
  const allowAgents = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents])
  const onChange =
    (index: number) =>
    ([ban]: SelectAgent[]) => {
      pipe(
        [...value],
        (list) => {
          list[index] = ban

          return list as [SelectAgent, SelectAgent]
        },
        (banList) => {
          setValue(banList)
          send(SOCKET_EVENT.BAN, { role: props.role, banList })
        }
      )
    }

  return (
    <div>
      <Typo.Heading className="heading-4xl text-ink" heading={1}>
        {props.role === 'A' ? '캐릭터 2개를 선택하여 밴을 진행해주세요.' : '선택중...'}
      </Typo.Heading>
      <div className="flex gap-20 justify-center mt-10">
        {pipe(
          value,
          zipWithIndex,
          map(([index, agent]) => (
            <Form.Party
              key={index}
              size="xl"
              filterAgents={allowAgents}
              banAgents={disabledAgents}
              value={[agent]}
              onChange={props.role === 'A' ? onChange(index) : undefined}
              deleteable={props.role === 'A'}
            />
          )),
          toArray
        )}
      </div>
      {props.role === 'A' && (
        <button
          type="submit"
          className={pipe(
            ['px-4', 'py-2', 'rounded-xl', 'block', 'mx-auto', 'mt-10', 'focus:outline-none'],
            concat(['text-ink', 'bg-content', 'cursor-pointer', 'heading-xl']),
            concat(['hover:text-content', 'hover:bg-primary']),
            concat([
              'disabled:cursor-not-allowed',
              'disabled:bg-content/50',
              'disabled:text-ink/50',
            ]),
            join(' ')
          )}
          disabled={includes(null, value)}
        >
          확인
        </button>
      )}
    </div>
  )
}

export default Ban
