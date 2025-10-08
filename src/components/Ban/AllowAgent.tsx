import { Setting } from '@/Icons'
import { useBan } from '@/hooks'
import { getAgentSquareImage } from '@/utils'
import { join, map, pipe, toArray } from '@fxts/core'

const AllowAgent: React.FC = () => {
  const { noBanList } = useBan()

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="dark:text-white text-2xl font-extrabold">Allow Agent</h3>
          <button type="button" className="size-6 cursor-pointer hidden">
            <Setting className="block w-full stroke-white" />
          </button>
        </div>
        <div className="flex">
          {pipe(
            noBanList,
            map((id) => (
              <div
                className={pipe(
                  [
                    'size-32',
                    'border-2',
                    'border-white',
                    'overflow-hidden',
                    'border-r-0',
                    'last:border-r-2',
                  ],
                  join(' ')
                )}
                key={id}
              >
                <img src={getAgentSquareImage(id)} alt="" className="block w-full" />
              </div>
            )),
            toArray
          )}
        </div>
      </div>
    </>
  )
}

export default AllowAgent
