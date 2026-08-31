import { join, concat, pipe, sum, values } from '@fxts/core'
import { Link } from '@remix-run/react'
import { SquareArrowOutUpRight } from 'lucide-react'
import { Role } from '~/constant'
import { useMatch, useCost } from '~/hooks'

const PlayerName: React.FC = () => {
  const { play } = useMatch()
  const totalCost = useCost()

  return (
    <div className="card p-4 flex w-full justify-between items-center rounded-3xl gap-4">
      <div className="flex flex-1 items-center">
        <div className="flex flex-col flex-1 items-end">
          <div className="border-b border-solid border-ink/30 w-full pb-4 relative flex-center gap-4">
            <h3 className="ft-ria text-primary text-4xl text-center">{play[Role.A_SIDE].name}</h3>
            <Link
              to={`/room/${play[Role.A_SIDE].id}`}
              target="_blank"
              className="my-auto hover:text-primary"
            >
              <SquareArrowOutUpRight className="size-8" />
            </Link>
          </div>
          {/* TODO: Chip 컴포넌트 추가 후 작업. 현재 블루 계열과 접속상태 계열 컬러가 미스매칭한 부분이 있음 */}
          <div className="flex gap-4 items-center mt-4 w-full">
            <div className="rounded-2xl border border-solid border-[#00a2ff] bg-[#00a2ff70] py-2 px-4 flex-center gap-2">
              <p className="text-xl">접속상태</p>
              <span
                className={pipe(
                  [
                    'text-[0px]',
                    'block',
                    'size-4',
                    'rounded-full',
                    'bg-secondary',
                    'animate-pulse',
                  ],
                  concat([]),
                  join(' ')
                )}
              >
                Circle
              </span>
            </div>
            {pipe(totalCost[Role.A_SIDE], values, sum, (cost) => (
              <p className="ft-pre text-lg flex items-end gap-1">
                <span className="ft-ria text-2xl text-primary leading-tight tabular-nums">
                  {cost}
                </span>
                <span className="ml-1 text-lg leading-tight font-black">Co.</span>
              </p>
            ))}
          </div>
        </div>
      </div>
      <span className="text-ink text-4xl ft-ria mx-4">VS</span>
      <div className="flex flex-1 items-center">
        <div className="flex flex-col flex-1 items-start">
          <div className="flex-center flex-1 gap-4">
            <h3 className="ft-ria text-primary text-4xl">{play[Role.B_SIDE].name}</h3>
            <Link
              to={`/room/${play[Role.B_SIDE].id}`}
              target="_blank"
              className="my-auto hover:text-primary"
            >
              <SquareArrowOutUpRight className="size-8" />
            </Link>
          </div>
          {pipe(totalCost[Role.B_SIDE], values, sum, (cost) => (
            <p className="ft-pre text-lg mt-4 flex items-end gap-1">
              <span className="ft-ria text-2xl text-primary leading-tight tabular-nums">
                {cost}
              </span>
              <span className="ml-1 text-lg leading-tight font-black">Co.</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlayerName
