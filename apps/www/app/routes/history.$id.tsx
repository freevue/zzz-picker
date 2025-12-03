import { flatMap, map, pipe, size, toArray, uniq } from '@fxts/core'
import { useParams } from '@remix-run/react'
import type { AuthData, HistoryData } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { History } from '~/components'

const HistoryPage: React.FC = () => {
  const { id } = useParams()
  const [history, setHistory] = useState<Array<HistoryData>>([])
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
      <History.People
        count={pipe(
          history,
          flatMap((item) => [item.aName, item.bName]),
          uniq,
          size
        )}
      />
      <History.BanCount
        count={pipe(
          history,
          flatMap(({ banList }) => banList),
          uniq,
          size
        )}
      />
      <History.PickCount
        count={pipe(
          history,
          flatMap(({ playList }) => playList),
          flatMap(({ aParty, bParty }) => [aParty, bParty]),
          flatMap(({ select_1, select_2, select_3 }) => [select_1, select_2, select_3]),
          map(({ agentId }) => agentId),
          uniq,
          size
        )}
      />
      <History.BestBoss history={history} />
      <History.BestBan history={history} />
      <History.BestPick history={history} />
    </div>
  )
}

export default HistoryPage
