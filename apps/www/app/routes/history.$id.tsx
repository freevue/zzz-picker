import { pipe, toArray } from '@fxts/core'
import { useParams } from '@remix-run/react'
import { useStore } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { History } from '~/components'

type AuthData = {
  createdAt: string
  id: string
  nameKo: string
  version: number
}

const HistoryPage: React.FC = () => {
  const { id } = useParams()
  const [history, setHistory] = useState<Array<any>>([])
  const { getHistory, getAuthKey } = useStore()
  const [authKey, setAuthKey] = useState<AuthData | null>(null)

  useEffect(() => {
    pipe(getHistory(id as string), toArray, (history) => setHistory(history))
    pipe(getAuthKey(id as string), toArray, ([authKey]) => setAuthKey(authKey))
  }, [id])

  return (
    <div className="size-full snap-y overflow-auto scrollbar-hidden">
      <History.Title title={authKey?.nameKo || ''} />
      <History.Date date={dayjs(authKey?.createdAt).format('YYYY년 MM월 DD일') || ''} />
      <History.Count count={history.length} />
      <History.People count={history.length * 2} />
    </div>
  )
}

export default HistoryPage
