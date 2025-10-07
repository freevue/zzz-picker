import { Drop } from '../'
import { Refresh } from '../../Icons'
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
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold dark:text-white">{props.title}</h2>
        <button className="cursor-pointer size-4" type="button">
          <Refresh className="stroke-gray-300 w-full h-full stroke-3" />
        </button>
      </div>
      <div className="flex gap-2">
        {pipe(
          3,
          range,
          map((index) => (
            <div key={index} className="border-1 border-gray-300 rounded-md overflow-hidden">
              <Drop />
              <label className="flex items-center text-xl p-1.5 gap-1 w-full border-t border-gray-300 dark:text-gray-300">
                <span>Cost:</span>
                <input
                  onChange={onCostChange}
                  data-index={index}
                  type="number"
                  className="block w-full focus:outline-none pl-0.5 border-b"
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
          <input
            type="text"
            placeholder="0"
            className="focus:outline-none px-1 py-0.5 w-20 border-b"
          />
        </label>
        <span>/</span>
        <label className="dark:text-gray-300 flex items-center gap-1">
          <span>Time:</span>
          <input
            type="text"
            placeholder="00:00"
            className="focus:outline-none px-1 py-0.5 w-20 border-b"
          />
        </label>
      </div>
    </div>
  )
}
const RineUp: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="닉네임"
        className="w-full block flex-1 py-1 px-1.5 text-3xl font-bold focus:outline-none dark:placeholder:text-gray-500 text-primary border-b"
      />
      {pipe(
        ['1 라운드', '2 라운드'],
        map((item) => <Round title={item} key={item} />),
        toArray
      )}
      <input
        type="text"
        placeholder="Total Score"
        className="focus:outline-none px-1 py-0.5 dark:text-gray-300 text-xl w-1/2 border-b"
      />
    </div>
  )
}

export default RineUp
