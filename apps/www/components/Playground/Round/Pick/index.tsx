import CostDialog from '../CostDialog'
import {
  join,
  pipe,
  toArray,
  concat,
  when,
  findIndex,
  filter,
  isNumber,
  includes,
} from '@fxts/core'
import { Form, Dialog, Typo } from '@zzz-picker/components/v2'
import {
  DEFAULT,
  type SelectAgent,
  type RoundId,
  type Side,
  type AgentId,
} from '@zzz-picker/constant'
import { usePlay, useSetting, useCostList } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'

type Props = {
  side: Side
  roundId: RoundId
}

const Pick: React.FC<Props> = (props) => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const { state: settingState } = useSetting()
  const { state, setState } = usePlay()
  const [selectedAgentId, setSelectedAgentId] = useState<SelectAgent>(null)
  const pickList = useMemo(
    () => state[props.roundId][props.side].pickList,
    [state[props.roundId][props.side].pickList]
  )
  const time = useMemo(
    () => state[props.roundId][props.side].time,
    [state, props.roundId, props.side]
  )
  const score = useMemo(
    () => state[props.roundId][props.side].result,
    [state, props.roundId, props.side]
  )
  const costList = useCostList(props.side, pickList)

  const onClick = (agentId: AgentId) => {
    setSelectedAgentId(agentId)
  }
  const onPickChange = (pickList: SelectAgent[]) => {
    setState((prev) =>
      pipe(
        { ...prev[props.roundId] },
        (roundData) => ({
          ...roundData,
          [props.side]: { ...prev[props.roundId][props.side], pickList },
        }),
        (roundData) => ({ ...prev, [props.roundId]: roundData })
      )
    )
  }
  const onTimeChange = (time: number) => {
    setState((prev) =>
      pipe(
        { ...prev[props.roundId] },
        (roundData) => ({
          ...roundData,
          [props.side]: { ...prev[props.roundId][props.side], time },
        }),
        (roundData) => ({ ...prev, [props.roundId]: roundData })
      )
    )
  }
  const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      when(
        (value) => value > DEFAULT.MAX_SCORE,
        () => DEFAULT.MAX_SCORE
      ),
      when(
        (value) => value < 0,
        () => 0
      ),
      (result) => {
        setState((prev) =>
          pipe(
            { ...prev[props.roundId] },
            (roundData) => ({
              ...roundData,
              [props.side]: { ...prev[props.roundId][props.side], result },
            }),
            (roundData) => ({ ...prev, [props.roundId]: roundData })
          )
        )
      }
    )
  }

  return (
    <>
      <div className="w-[336px]">
        <div
          className={pipe(
            ['w-full flex flex-col', 'gap-4'],
            concat([props.side === 'A' ? 'items-start' : 'items-end']),
            join(' ')
          )}
        >
          <Form.Time.Input
            value={time}
            name={`${props.roundId}-${props.side}-time`}
            onChange={onTimeChange}
            className={pipe(
              ['w-56', 'h-14', 'bg-content', 'overflow-hidden'],
              concat(props.side === 'A' ? ['rounded-tr-2xl'] : []),
              concat(props.side === 'B' ? ['rounded-tl-2xl'] : []),
              join(' ')
            )}
          />
          <Form.Party
            size="md"
            reverse={props.side === 'B'}
            value={pickList}
            cost={costList}
            allowAgents={settingState.allowAgent}
            banAgents={pipe(state.banList, filter(isNumber), toArray)}
            deleteable
            onChange={onPickChange}
            onClick={onClick}
          />
          <Form.Input
            name={`${props.roundId}-${props.side}-score`}
            value={`${score}`}
            max={DEFAULT.MAX_SCORE}
            min={0}
            step={1}
            type="number"
            onChange={onScoreChange}
            className={pipe(
              ['w-56', 'h-14', 'bg-content', '[&_input]:text-3xl', '[&_input]:font-black'],
              concat(
                props.side === 'A' ? ['rounded-bl-2xl', 'ml-auto', '[&_input]:text-right'] : []
              ),
              concat(
                props.side === 'B' ? ['rounded-br-2xl', 'mr-auto', '[&_input]:text-left'] : []
              ),
              join(' ')
            )}
          />
        </div>
      </div>
      <Dialog isOpen={!!selectedAgentId} onClose={() => setSelectedAgentId(null)}>
        <CostDialog
          roundId={props.roundId}
          side={props.side}
          agentId={Number(selectedAgentId)}
          totalCost={pipe(
            pickList,
            findIndex((id) => id === selectedAgentId),
            (index) => costList[index] || 0
          )}
        />
      </Dialog>
      <Dialog
        className="w-2xl"
        name="seed-birthday"
        isOpen={isEventDialogOpen}
        once
        onClose={() => setIsEventDialogOpen(false)}
      >
        <Typo.Heading className="heading-4xl text-primary" heading={2}>
          생일 축하해, 의현 | 소박한 만찬
        </Typo.Heading>
        <div className="flex flex-col gap-2 my-4">
          <Typo.Body className="body-md text-foreground text-center">
            「복복 사저! 이 장수 찐빵은 사부님을 위해 특별히 준비한 거야. 게다가 사저는 아침에
            부엌에서 『마지막으로 하나만 더 먹을게요』라고 하면서 이미 먹었잖아!」
          </Typo.Body>
          <Typo.Body className="body-md text-foreground text-center">
            「인호, 준비하느라 애썼어. 신경 안 써도 돼, 너희들의 마음은 이미 충분히 전해졌으니까」
          </Typo.Body>
          <Typo.Body className="body-md text-foreground text-center">
            「아니에요, 사부님. 평소보다 파만 한 움큼 더 넣었을 뿐인데요, 뭘~」
          </Typo.Body>
        </div>
        <div className="aspect-[720/960] w-full rounded-tr-2xl rounded-bl-2xl overflow-hidden">
          <img
            src="https://fastcdn.hoyoverse.com/content-v2/nap/161237/2c2ec6da2d12c48149dc3e34fd916c1c_5587138374661856310.png"
            alt="birthday"
            className="w-full block"
          />
        </div>
      </Dialog>
    </>
  )
}

export default Pick
