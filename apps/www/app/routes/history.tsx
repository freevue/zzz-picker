import { useStore } from '@zzz-picker/provider/hooks'
import { useEffect } from 'react'

const History: React.FC = () => {
  const { getHistory } = useStore()

  useEffect(() => {
    getHistory('4a197b31-abd6-4e5b-a8ba-7818c96b51cb').then((history) => {
      console.log(history)
    })
  }, [])

  return (
    <div className="size-full flex flex-col items-center justify-center gap-10">
      <div className="w-full h-full overflow-auto scrollbar-hidden">History</div>
    </div>
  )
}

export default History
