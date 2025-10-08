import AgentDialog from './AgentDialog'
import { Plus, Cross } from '@/Icons'
import { useBan } from '@/hooks'
import { getAgentSquareImage } from '@/utils'
import { pipe, zipWithIndex, map, toArray } from '@fxts/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

const AgentCard: React.FC<{ id: number | null; index: number }> = (props) => {
  const { setBanList } = useBan()
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false)

  const onBanClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBanList(Number(event.currentTarget.value), props.index)
    setIsAgentDialogOpen(false)
  }
  const onDelete = () => {
    setBanList(null, props.index)
  }

  return (
    <>
      <div className="h-32 w-full">
        {props.id ? (
          <div className="relative w-full h-full flex items-start justify-center overflow-hidden group">
            <img src={getAgentSquareImage(props.id)} className="block w-full" alt="" />
            <button
              type="button"
              onClick={onDelete}
              className="absolute left-0 top-0 w-full h-full flex items-center justify-center cursor-pointer backdrop-blur-sm scale-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"
            >
              <Cross className="block size-8 stroke-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsAgentDialogOpen(true)}
          >
            <Plus className="size-10" />
          </button>
        )}
      </div>
      {isAgentDialogOpen &&
        createPortal(
          <AgentDialog onClose={() => setIsAgentDialogOpen(false)} onClick={onBanClick} />,
          document.body!
        )}
    </>
  )
}

const Ban = () => {
  const { banList } = useBan()

  return (
    <>
      <div>
        <h2 className="text-3xl text-primary font-black mb-4">Ban</h2>
        <ul className="grid grid-cols-3 border-l-2 border-white">
          {pipe(
            banList,
            zipWithIndex,
            map(([index, id]) => (
              <li
                key={index}
                className="border-2 border-white border-l-0 border-t-0 first:border-t-2 nth-of-type-[2]:border-t-2 nth-of-type-[3]:border-t-2"
              >
                <AgentCard id={id} index={index} />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
    </>
  )
}

export default Ban
