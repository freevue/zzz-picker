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
      </div>
    </div>
  )
}

export default RuleBook
