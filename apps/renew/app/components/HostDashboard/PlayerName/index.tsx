import { Chip } from '@/components'
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
          <div className="flex gap-4 items-center mt-4 w-full justify-center">
            <Chip className="rounded-2xl gap-2">
              <p className="text-xl">접속상태</p>
              <span
                className={pipe(
                  ['text-[0px]', 'block', 'size-4', 'rounded-full'],
                  concat(
                    play[Role.A_SIDE].isConnected
                      ? ['bg-secondary', 'animate-pulse']
                      : ['bg-red-400']
                  ),
                  join(' ')
                )}
              >
                Circle
              </span>
            </Chip>
            {pipe(totalCost[Role.A_SIDE], values, sum, (cost) => (
              <Chip className="rounded-2xl">
                <p className="flex items-end gap-1">
                  <span className="ft-ria text-primary leading-tight tabular-nums">{cost}</span>
                  <span className="ml-1 text-lg leading-tight font-black">Co.</span>
                </p>
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <span className="text-ink text-4xl ft-ria mx-4">VS</span>
      <div className="flex flex-1 items-center">
        <div className="flex flex-col flex-1 items-end">
          <div className="border-b border-solid border-ink/30 w-full pb-4 relative flex-center gap-4">
            <Link
              to={`/room/${play[Role.B_SIDE].id}`}
              target="_blank"
              className="my-auto hover:text-primary"
            >
              <SquareArrowOutUpRight className="size-8" />
            </Link>
            <h3 className="ft-ria text-primary text-4xl text-center">{play[Role.B_SIDE].name}</h3>
          </div>
          <div className="flex gap-4 items-center mt-4 w-full justify-center">
            {pipe(totalCost[Role.B_SIDE], values, sum, (cost) => (
              <Chip className="rounded-2xl">
                <p className="flex items-end gap-1">
                  <span className="ft-ria text-primary leading-tight tabular-nums">{cost}</span>
                  <span className="ml-1 text-lg leading-tight font-black">Co.</span>
                </p>
              </Chip>
            ))}
            <Chip className="rounded-2xl gap-2">
              <p className="text-xl">접속상태</p>
              <span
                className={pipe(
                  ['text-[0px]', 'block', 'size-4', 'rounded-full'],
                  concat(
                    play[Role.B_SIDE].isConnected
                      ? ['bg-secondary', 'animate-pulse']
                      : ['bg-red-400']
                  ),
                  join(' ')
                )}
              >
                Circle
              </span>
            </Chip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerName
