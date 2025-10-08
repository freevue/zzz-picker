import { useSetting } from '@/hooks'
import { map, pipe, range, toArray, zipWithIndex } from '@fxts/core'
import { useEffect, useState } from 'react'

const RuleBook = () => {
  const { banCount } = useSetting()
  const [banList, setBanList] = useState<(number | null)[]>([])

  useEffect(() => {
    pipe(
      banCount,
      range,
      map(() => null),
      toArray,
      (list) => {
        setBanList(list)
      }
    )
  }, [banCount])

  return (
    <div className="dark:text-white p-4 bg-base w-md">
      {banList.length > 0 && (
        <div>
          <h2 className="text-3xl text-primary font-semibold mb-4">Ban</h2>
          <ul className="grid grid-cols-3 border-l-2 border-white">
            {pipe(
              banList,
              zipWithIndex,
              map(([index]) => (
                <li
                  key={index}
                  className="border-2 border-white border-l-0 border-t-0 first:border-t-2 nth-of-type-[2]:border-t-2 nth-of-type-[3]:border-t-2"
                >
                  <div className="size-36"></div>
                </li>
              )),
              toArray
            )}
          </ul>
        </div>
      )}
      <div className="mt-10">
        <h2 className="text-3xl text-primary font-semibold mb-4">경기 규칙</h2>
        <div>
          <p>lorem ipsum dolor sit amet</p>
          <p>lorem ipsum dolor sit amet</p>
        </div>
      </div>
    </div>
  )
}

export default RuleBook
