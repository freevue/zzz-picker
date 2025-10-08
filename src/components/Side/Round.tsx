import Pick from './Pick'
import RecordDialog from './RecordDialog'
import { Edit } from '@/Icons'
import { useScore } from '@/hooks'
import { useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: React.ReactNode
  round: string
}

const Round: React.FC<Props> = (props) => {
  const { score, setScore } = useScore()
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)

  const onEditClick = () => {
    setIsRecordDialogOpen(true)
  }
  const onClose = () => {
    setIsRecordDialogOpen(false)
  }
  const onSubmit = (score: number, time: string) => {
    setScore(props.round, { score, time })
    setIsRecordDialogOpen(false)
  }

  return (
    <>
      <div className="mt-12 flex flex-col gap-2">
        <h3 className="text-2xl font-bold dark:text-white text-center">{props.children}</h3>
        <p className="text-md font-medium text-center dark:text-white/70">
          {score[props.round]?.score} 점 / {score[props.round]?.time}
        </p>
        <div className="flex justify-between items-center">
          <Pick side="A" />
          <button
            className="size-10 block cursor-pointer focus:outline-none group"
            type="button"
            onClick={onEditClick}
          >
            <Edit className="stroke-white block w-full group-hover:stroke-primary" />
          </button>
          <Pick side="B" />
        </div>
      </div>
      {isRecordDialogOpen &&
        createPortal(<RecordDialog onClose={onClose} onSubmit={onSubmit} />, document.body)}
    </>
  )
}

export default Round
