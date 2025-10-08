import { UI } from '@/components'
import { useBan } from '@/hooks'
import { map, pipe, toArray } from '@fxts/core'

const Ban: React.FC = () => {
  const { setBanList, noBanList } = useBan()

  const onBanChange = (id: number | null) => {
    id && setBanList(id)
  }

  return (
    <div className="flex gap-10 mt-8 pt-8 border-t border-gray-300">
      <div className="flex-1">
        <h3 className="dark:text-white text-2xl font-bold">Ban</h3>
        <div className="flex gap-2">
          <div className="border-1 border-gray-300 rounded-md overflow-hidden">
            <UI.Drop onChange={onBanChange} />
          </div>
          <div className="border-1 border-gray-300 rounded-md overflow-hidden">
            <UI.Drop onChange={onBanChange} />
          </div>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="dark:text-white text-2xl font-extrabold flex items-end gap-1">
          Allow Agent <span className="text-xl opacity-80">(Pick-up)</span>
        </h3>
        <div className="flex gap-2">
          {pipe(
            noBanList,
            map((id) => (
              <div className="border-1 border-gray-300 rounded-md overflow-hidden" key={id}>
                <UI.Drop defaultValue={id} />
              </div>
            )),
            toArray
          )}
        </div>
      </div>
    </div>
  )
}

export default Ban
