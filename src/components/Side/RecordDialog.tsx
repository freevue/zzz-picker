import { UI } from '@/components'

type Props = {
  onClose: () => void
}

const RecordDialog: React.FC<Props> = (props) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(event.target)
  }

  return (
    <UI.Dialog
      onClose={props.onClose}
      className="bg-base p-4 border-1 border-gray-700 rounded-md max-h-3/4 flex flex-col w-xl"
    >
      <form onSubmit={onSubmit}>
        <h2 className="text-3xl font-semibold dark:text-white mb-8">Round 기록</h2>
        <div className="flex p-4 mb-4">
          <h2 className="text-2xl flex-1/3 font-black dark:text-white italic">Score</h2>
          <div className="flex-2/3 flex items-center gap-2">
            <UI.Input className="flex-1" />
            <p className="dark:text-white text-2xl font-bold">점</p>
          </div>
        </div>
        <div className="flex p-4">
          <h2 className="text-2xl flex-1/3 font-black dark:text-white italic">Time</h2>
          <div className="flex-2/3">
            <UI.Time />
          </div>
        </div>
        <button
          className="bg-primary block text-gray-700 font-bold px-4 py-2 rounded-md ml-auto mt-10 cursor-pointer opacity-90 hover:opacity-100"
          type="submit"
        >
          저장
        </button>
      </form>
    </UI.Dialog>
  )
}

export default RecordDialog
