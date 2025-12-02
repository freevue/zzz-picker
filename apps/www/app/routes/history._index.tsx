import { map, peek, pipe, toArray } from '@fxts/core'
import { useStore } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const History: React.FC = () => {
  const { getHistory, getAuthKeyList } = useStore()
  const [authKeyList, setAuthKeyList] = useState<
    Array<{ id: string; nameKo: string; version: string; createdAt: string }>
  >([])

  useEffect(() => {
    // getHistory('4a197b31-abd6-4e5b-a8ba-7818c96b51cb').then((history) => {
    //   console.log(history)
    // })

    pipe(
      getAuthKeyList(),
      map((auth) => ({ ...auth, createdAt: dayjs(auth.createdAt).format('YYYY-MM-DD') })),
      toArray,
      (authKeyList) => setAuthKeyList(authKeyList)
    )
  }, [])

  return (
    <div className="size-full flex flex-col items-center justify-center gap-10">
      {/* <div className="w-full h-full overflow-auto scrollbar-hidden">History</div> */}
      <ul>
        {pipe(
          authKeyList,
          map((auth) => (
            <li key={auth.id} className="body-lg text-ink">
              <span>{auth.nameKo}</span>/<span>{auth.version}</span>/<span>{auth.createdAt}</span>
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default History
