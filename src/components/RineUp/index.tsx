import { Drop } from '../'
import { map, pipe, range, sum, toArray } from '@fxts/core'
import { useState } from 'react'

const Round: React.FC<{ title: string }> = (props) => {
  const [totalCost, setTotalCost] = useState<Array<number>>([0, 0, 0])

  const onCostChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.dataset.index)

    setTotalCost((prev) => {
      const newTotalCost = [...prev]
      newTotalCost[index] = Number(event.target.value)

      return newTotalCost
    })
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold dark:text-white">{props.title}</h2>
      <div className="flex gap-2">
        {pipe(
          3,
          range,
          map((index) => (
            <div key={index} className="border-1 border-gray-300 rounded-md overflow-hidden">
              <Drop />
              <label className="flex items-end gap-1 w-full border-t border-gray-300">
                <input
                  onChange={onCostChange}
                  data-index={index}
                  type="number"
                  className="block w-full py-1 px-1.5 text-xl focus:outline-none rounded-md dark:text-gray-300"
                  defaultValue={0}
                  min={0}
                  max={10}
                />
              </label>
            </div>
          )),
          toArray
        )}
      </div>
      <p className="mt-2 opacity-70 px-1 text-xl dark:text-gray-300 items-center">
        Total Cost: {sum(totalCost)}
      </p>
      <div className="flex gap-3 opacity-70 px-1 text-xl dark:text-gray-300 items-center w-full">
        <label className="dark:text-gray-300 flex items-center gap-1">
          <span>Score:</span>
          <input type="text" placeholder="0" className="focus:outline-none px-1 py-0.5 w-20" />
        </label>
        <span>/</span>
        <label className="dark:text-gray-300 flex items-center gap-1">
          <span>Time:</span>
          <input type="text" placeholder="00:00" className="focus:outline-none px-1 py-0.5 w-20" />
        </label>
      </div>
    </div>
  )
}
const RineUp: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <input
          type="text"
          placeholder="닉네임"
          className="w-1/2 block flex-1 py-1 px-1.5 text-3xl font-bold focus:outline-none rounded-md dark:placeholder:text-gray-500 text-primary"
        />
        <input
          type="text"
          placeholder="Total Score"
          className="focus:outline-none px-1 py-0.5 dark:text-gray-300 text-xl w-1/2"
        />
      </div>
      {pipe(
        ['1 라운드', '2 라운드'],
        map((item) => <Round title={item} key={item} />),
        toArray
      )}
    </div>
  )
}

export default RineUp
