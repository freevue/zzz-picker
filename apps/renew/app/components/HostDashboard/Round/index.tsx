import CardTitle from '../CardTitle'
import AgentList from './AgentList'
import BossButton from './BossButton'
import Score from './Score'
import Timer from './Timer'
import { filter, find, isObject, isUndefined, join, map, pipe, sum } from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatch, useStore } from '~/hooks'

type Props = {
  round: number
}

const Round: React.FC<Props> = (props) => {
  const { play, match } = useMatch()
  const store = useStore()
  const roundCost = useMemo(() => {
    return {
      [Role.A_SIDE]: {
        agentCost: pipe(
          play[Role.A_SIDE].agentSlot[props.round],
          map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
          filter(({ agent }) => !isUndefined(agent)),
          map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
        engineCost: pipe(
          play[Role.A_SIDE].engineSlot[props.round],
          map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
          filter(({ engine }) => !isUndefined(engine)),
          map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
      },
      [Role.B_SIDE]: {
        agentCost: pipe(
          play[Role.B_SIDE].agentSlot[props.round],
          map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
          filter(({ agent }) => !isUndefined(agent)),
          map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
        engineCost: pipe(
          play[Role.B_SIDE].engineSlot[props.round],
          map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
          filter(({ engine }) => !isUndefined(engine)),
          map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
      },
    }
  }, [play, props.round, store])
  /**
   * TODO: 특정 라운드의 특정 참가자의 파티 및 cost 구성을 pip로 올리려는 시도.
   * 현재 해당하는 element를 바로 svg로 만들어 구성하려고 했으나, element를 object로 구성하는 단계에 보안 문제가 발생
   * 해당 canvas는 그릴 수 있으나, canvas를 캡처하여 활용하는 것은 불가능함 (video에 보낼 stream을 구성하지 못하는 이슈 발생)
   *
   * 직접 svg에 해당하는 요소들을 받아와 svg를 구성하는 시도가 필요할수도..
   * (애초에 pip가 필요할지 먼제 확인을 해야할 수도?)
   */
  // const onPipOpen = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault()

  //   await pipe(
  //     event.currentTarget.parentElement!,
  //     (element) => element.querySelector<HTMLUListElement>('ul[role="agent-list"]')!,
  //     elementToImage(12),
  //     (url) => {
  //       const image = new Image()

  //       image.onload = async () => {
  //         const dpr = max([window.devicePixelRatio || 1, 2])
  //         const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!

  //         canvas.width = image.naturalWidth * dpr
  //         canvas.height = image.naturalHeight * dpr
  //         canvas.style.width = `${image.naturalWidth * dpr}px`
  //         canvas.style.height = `${image.naturalHeight * dpr}px`

  //         const context = canvas!.getContext('2d')

  //         if (context) {
  //           context.imageSmoothingEnabled = true
  //           context.imageSmoothingQuality = 'high'

  //           context.clearRect(0, 0, canvas.width, canvas.height)
  //           context.drawImage(image, 12, 12, canvas.width, canvas.height)

  //           await pipe(canvas.captureStream(30), async (stream) => {
  //             const video = document.createElement('video')

  //             video.muted = true
  //             video.autoplay = true
  //             video.srcObject = stream

  //             await video.play()
  //             await video.requestPictureInPicture()
  //           })
  //         }

  //         URL.revokeObjectURL(url)
  //       }

  //       image.src = url
  //     }
  //   )
  // }

  return (
    <div
      className={pipe(
        [
          'card',
          'p-4',
          'w-full',
          'rounded-3xl',
          'relative',
          'flex-1',
          'flex',
          'flex-col',
          'justify-around',
          'relative',
        ],
        join(' ')
      )}
    >
      <CardTitle className="text-center" active={match.phase === Phase.PICK}>
        {props.round + 1} Round
      </CardTitle>
      <div className="flex justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start gap-4">
            <div className="flex gap-2">
              <Timer round={props.round} role={Role.A_SIDE} id={match.matchId} />
              <Score round={props.round} role={Role.A_SIDE} id={match.matchId} />
            </div>
            <div className="flex-1 flex gap-4 items-start">
              <AgentList
                list={play[Role.A_SIDE].agentSlot[props.round]}
                engines={play[Role.A_SIDE].engineSlot[props.round]}
                role={Role.A_SIDE}
              />
              <div className="mt-auto ml-1 w-28 flex flex-col items-center">
                <BossButton bossId={play[Role.A_SIDE].boss[props.round]} />
                <p className="ft-pre text-lg mt-4 text-center flex items-end gap-1">
                  <span className="ft-ria text-2xl text-primary leading-tight tabular-nums">
                    {roundCost[Role.A_SIDE].agentCost + roundCost[Role.A_SIDE].engineCost}
                  </span>
                  <span className="ml-1 text-lg leading-tight font-black">Co.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 flex-row-reverse">
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-2">
              <Score round={props.round} role={Role.B_SIDE} id={match.matchId} />
              <Timer round={props.round} role={Role.B_SIDE} id={match.matchId} />
            </div>
            <div className="flex-1 flex gap-4 items-start flex-row-reverse">
              <AgentList
                list={play[Role.B_SIDE].agentSlot[props.round]}
                engines={play[Role.B_SIDE].engineSlot[props.round]}
                role={Role.B_SIDE}
              />
              <div className="mt-auto mr-1 w-24 flex flex-col items-center">
                <BossButton bossId={play[Role.B_SIDE].boss[props.round]} />
                <p className="ft-pre text-lg mt-4 text-center flex items-end gap-1">
                  <span className="ft-ria text-2xl text-primary leading-tight tabular-nums">
                    {roundCost[Role.B_SIDE].agentCost + roundCost[Role.B_SIDE].engineCost}
                  </span>
                  <span className="ml-1 text-lg leading-tight font-black">Co.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Round

// https://images.zzz.freevue.dev/images/alice/654a1009-322b-4d4f-89c2-5706f58dabc4.jpg
// https://images.zzz.freevue.dev/images/agents/156728/3edd3a9c-8886-4147-89b5-f2e3c01d7be7.webp
