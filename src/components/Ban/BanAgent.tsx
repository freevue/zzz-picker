import Drop from './Drop'
import { useBan } from '@/hooks'
import { pipe, map, toArray, zipWithIndex } from '@fxts/core'

const Ban: React.FC = () => {
  const { setBanList, banList } = useBan()

  const onBanChange = (id: number | null, index: number) => {
    setBanList(id, index)
  }

  return (
    <div>
      <h3 className="dark:text-white text-2xl font-bold mb-2">Ban</h3>
      <div className="flex">
        {pipe(
          banList,
          zipWithIndex,
          map(([index, id]) => (
            <Drop key={index} index={index} defaultValue={id} onChange={onBanChange} />
          )),
          toArray
        )}
      </div>
    </div>
  )
}

export default Ban
