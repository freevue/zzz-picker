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
    console.log(pickList)
    setIsEventDialogOpen(includes(157829, pickList))
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
          생일 축하해, 「시드」 | 꽃이 피는 도중에
        </Typo.Heading>
        <div className="flex flex-col gap-2 my-4">
          <Typo.Body className="body-md text-foreground text-center">
            「꽃바다의 꽃이 정말 예쁘게 피었어. 그런데 우리끼리만 감상하는 건 조금 이기적이지
            않을까…」
          </Typo.Body>
          <Typo.Body className="body-md text-foreground text-center">
            「응응~ 꼭 『숯덩이』가 『빅 시드』의 조종석을 독차지하려 했던 것처럼 말이야」
          </Typo.Body>
          <Typo.Body className="body-md text-foreground text-center">
            「『빅 시드』~ 꽃을 꺾어다 꽃다발로 만들어서, 모두에게 보여주는 건 어떨까?」
          </Typo.Body>
          <Typo.Body className="body-md text-foreground text-center">
            「영원히 만개한 꽃바다는 없대도, 우리가 이 꽃들을 기억하는 한 봄은 끝나지 않으니까」
          </Typo.Body>
        </div>
        <div className="aspect-[720/960] w-full rounded-tr-2xl rounded-bl-2xl overflow-hidden">
          <img
            src="https://fastcdn.hoyoverse.com/content-v2/nap/160970/34ac54779478ecde5fcf9e0c5d99a7d7_1619640581666503425.png"
            alt="seed-birthday"
            className="w-full block"
          />
        </div>
      </Dialog>
    </>
  )
}

export default Pick
