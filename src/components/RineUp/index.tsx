import { Refresh } from '@/Icons'
import { UI } from '@/components'
import { map, pipe, range, toArray } from '@fxts/core'
import { useState } from 'react'

const Round: React.FC<{ title: string }> = (props) => {
  const [, setTotalCost] = useState<Array<number>>([0, 0, 0])

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
      <table className="dark:text-gray-300 border-b border-gray-300">
        <tbody>
          <tr>
            {pipe(
              3,
              range,
              map((index) => (
                <td
                  key={index}
                  className="border-1 border-gray-300 overflow-hidden border-r-0 last:border-r-1"
                >
                  <div className="overflow-hidden">
                    <div className="p-1.5 border-b border-gray-300">
                      <label className="flex items-center text-xl gap-1 w-full dark:text-gray-300">
                        <input
                          onChange={onCostChange}
                          data-index={index}
                          type="number"
                          placeholder="Cost"
                          className="block w-full focus:outline-none"
                          min={0}
                          max={10}
                        />
                      </label>
                    </div>
                    <UI.Drop />
                  </div>
                </td>
              )),
              toArray
            )}
          </tr>
          <tr>
            <td className="border-l border-gray-300 p-1.5 text-xl">Score</td>
            <td colSpan={2} className="border-l border-gray-300 p-1.5 text-xl border-r">
              <input
                type="number"
                placeholder="0"
                min={0}
                max={70_000}
                className="focus:outline-none w-full block"
              />
            </td>
          </tr>
          <tr>
            <td className="border-l border-gray-300 p-1.5 text-xl border-t">Time</td>
            <td colSpan={2} className="border-l border-gray-300 p-1.5 text-xl border-t border-r">
              <input type="text" placeholder="00:00" className="focus:outline-none w-full block" />
            </td>
          </tr>
        </tbody>
      </table>
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
      <p className="mt-2 opacity-70 text-xl dark:text-gray-300 items-center">Total Cost: 0</p>
      <label className="flex items-center gap-1 text-2xl dark:text-white font-semibold">
        <span>Total Score:</span>
        <input
          type="number"
          placeholder="0"
          min={0}
          max={500_000}
          className="focus:outline-none flex-1 px-1 py-0.5 border-b text-primary appearance-none"
        />
      </label>
    </div>
  )
}

export default RineUp
