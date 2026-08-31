import Table from './Table'
import { filter, map, pipe, sort, toArray, values, zipWithIndex } from '@fxts/core'
import { useState } from 'react'
import { useStore } from '~/hooks'

const EngineCostTable = () => {
  const { engines } = useStore()
  const [engineFilter, setEngineFilter] = useState<'S_PICK' | 'S' | 'A' | 'B'>('S_PICK')

  const onTabChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEngineFilter(event.target.value as 'S_PICK' | 'S' | 'A' | 'B')
  }

  return (
    <>
      <ul className="flex h-8 rounded-3xl overflow-hidden ml-auto bg-accent">
        <li className="h-full">
          <label className="group h-full flex-center has-checked:bg-primary cursor-pointer">
            <input
              type="radio"
              name="engine"
              defaultChecked
              className="appearance-none"
              onChange={onTabChange}
              value="S_PICK"
            />
            <p className="px-4 ft-pre text-ink group-has-checked:text-accent font-bold select-none">
              S 픽업
            </p>
          </label>
        </li>
        <li className="h-full">
          <label className="group h-full flex-center has-checked:bg-primary cursor-pointer">
            <input
              type="radio"
              name="engine"
              className="appearance-none"
              onChange={onTabChange}
              value="S"
            />
            <p className="px-4 ft-pre text-ink group-has-checked:text-accent font-bold select-none">
              S 상시
            </p>
          </label>
        </li>
        <li className="h-full">
          <label className="group h-full flex-center has-checked:bg-primary cursor-pointer">
            <input
              type="radio"
              name="engine"
              className="appearance-none"
              onChange={onTabChange}
              value="A"
            />
            <p className="px-4 ft-pre text-ink group-has-checked:text-accent font-bold select-none">
              A
            </p>
          </label>
        </li>
        <li className="h-full">
          <label className="group h-full flex-center has-checked:bg-primary cursor-pointer">
            <input
              type="radio"
              name="engine"
              className="appearance-none"
              onChange={onTabChange}
              value="A"
            />
            <p className="px-4 ft-pre text-ink group-has-checked:text-accent font-bold select-none">
              B
            </p>
          </label>
        </li>
      </ul>
      <Table>
        <colgroup>
          <col width="150px" />
          <col width="60px" />
          <col width="60px" />
          <col width="60px" />
          <col width="60px" />
          <col width="60px" />
        </colgroup>
        <thead>
          <tr className="h-10 *:sticky *:top-0 *:bg-accent ft-pre">
            <th className="left-0 z-20">이름</th>
            <th>1 돌파</th>
            <th>2 돌파</th>
            <th>3 돌파</th>
            <th>4 돌파</th>
            <th>풀 돌파</th>
          </tr>
        </thead>
        <tbody>
          {pipe(
            engines,
            values,
            filter((engine) => {
              if (engineFilter === 'S_PICK') return engine.rank === 'S' && engine.isPickup
              if (engineFilter === 'S') return engine.rank === 'S' && !engine.isPickup
              if (engineFilter === 'A') return engine.rank === 'A'
              if (engineFilter === 'B') return engine.rank === 'B'

              return false
            }),
            sort((prev, cur) => prev.nameKo.localeCompare(cur.nameKo)),
            map((engine) => (
              <tr
                key={engine.id}
                className="*:py-4 *:border-b *:border-ink/20 *:border-solid last:*:border-0"
              >
                <td className="sticky left-0 bg-base ft-pre font-bold">
                  <img
                    className="size-12 rounded-full block mx-auto mb-2"
                    src={engine.banner}
                    alt={engine.nameKo}
                  />
                  <p className="w-max mx-auto text-sm">{engine.nameKo}</p>
                </td>
                {pipe(
                  engine.cost,
                  sort((prev, cur) => (prev.rate > cur.rate ? 1 : -1)),
                  zipWithIndex,
                  map(([index, { cost }]) => (
                    <td className="ft-ria text-center" key={index}>
                      {cost}
                    </td>
                  )),
                  toArray
                )}
              </tr>
            )),
            toArray
          )}
        </tbody>
      </Table>
    </>
  )
}

export default EngineCostTable
