import { UI } from '@/components'
import { pipe } from '@fxts/core'

type Props = {
  onClose: () => void
  onSubmit: (score: number, time: string) => void
}

const RecordDialog: React.FC<Props> = (props) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    pipe(new FormData(event.currentTarget), (data) => {
      const score = data.get('score')
      const minute = data.get('time-minute')
      const second = data.get('time-second')

      props.onSubmit(Number(score), `${minute || '00'}분 ${second || '00'}초`)
    })
  }

  return (
    <UI.Dialog onClose={props.onClose} className="p-4 border-1 bg-bg-content border-secondary w-xl">
      <UI.Typo.Heading primary className="mb-10">
        Round 기록
      </UI.Typo.Heading>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-8">
          <UI.Typo.Heading className="text-xl">점수</UI.Typo.Heading>
          <div className="flex-2/3 flex items-center gap-2">
            <UI.Input type="number" className="flex-1 [&_input]:text-right" name="score" />
            <p className="dark:text-white text-2xl font-bold">점</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <UI.Typo.Heading className="text-xl">시간</UI.Typo.Heading>
          <div className="flex-2/3">
            <UI.Time name="time" />
          </div>
        </div>
        <button
          className="bg-primary block text-bg-content font-black px-4 py-2 ml-auto mt-10 cursor-pointer opacity-90 hover:opacity-100"
          type="submit"
        >
          저장
        </button>
      </form>
    </UI.Dialog>
  )
}

export default RecordDialog
