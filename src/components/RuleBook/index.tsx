import Ban from './Ban'
import { UI } from '@/components'
import { pipe } from '@fxts/core'
import { useEffect, useState } from 'react'

const RuleBook = () => {
  const [commonStage, setCommonStage] = useState('')

  const onStageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (params) => {
        setCommonStage(event.target.value)
        params.set('commonStage', event.target.value)
        window.history.pushState({}, '', `?${params.toString()}`)
      }
    )
  }

  useEffect(() => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (params) => params.get('commonStage'),
      (commonStage) => {
        setCommonStage(commonStage || '')
      }
    )
  }, [])

  return (
    <div className="dark:text-white p-4 bg-base w-md flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hidden">
      <div className="mb-10">
        <UI.Typo.Heading primary className="mb-4">
          공용 무대
        </UI.Typo.Heading>
        <UI.Input defaultValue={commonStage} onChange={onStageChange} />
      </div>
      <Ban />
      <div className="mt-10 flex-1">
        <UI.Typo.Heading primary className="mb-4">
          경기 규칙
        </UI.Typo.Heading>
        <div>
          <h3 className="text-xl text-white font-bold mb-2">Cost 설정</h3>
          <div className="mb-4">
            <h4>캐릭터</h4>
            <table className="w-full overflow-hidden">
              <colgroup>
                <col width="33%" />
                <col width="33%" />
              </colgroup>
              <thead>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">등급</th>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">명함</th>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">돌파당</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700">S급 픽업</th>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    +1
                  </td>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    +1
                  </td>
                </tr>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700">S급 상시</th>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    +1
                  </td>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    0
                  </td>
                </tr>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700">A급 상시</th>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    0
                  </td>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mb-4">
            <h4>엔진</h4>
            <table className="w-full overflow-hidden">
              <colgroup>
                <col width="33%" />
                <col width="33%" />
              </colgroup>
              <thead>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">등급</th>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">명함</th>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">돌파당</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">S급</th>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    +1
                  </td>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    0
                  </td>
                </tr>
                <tr>
                  <th className="border-1 border-gray-700 bg-gray-700 p-2">A급</th>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    0
                  </td>
                  <td className="text-center border-r-1 border-b-1 border-gray-700 font-bold p-2">
                    0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RuleBook
