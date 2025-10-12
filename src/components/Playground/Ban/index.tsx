import AgentDialog from './AgentDialog'
import { Plus, Cross } from '@/Icons'
import { UI } from '@/components'
import { useBan, useSetting } from '@/hooks'
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
      <div className="h-full">
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
            className="w-full h-full flex items-center justify-center cursor-pointer group"
            onClick={() => setIsAgentDialogOpen(true)}
          >
            <Plus className="size-10 stroke-text-primary group-hover:stroke-secondary" />
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
  const { state } = useSetting()

  return (
    <div className="flex w-full flex-1 gap-4 overflow-hidden">
      {state.allowAgent.length > 0 && (
        <div className="flex-1">
          <UI.Typo.Heading className="text-xl" primary>
            Allow
          </UI.Typo.Heading>
          <ul className="flex border-l-2 border-text-primary mt-4 w-full overflow-x-auto">
            {pipe(
              state.allowAgent,
              map((id) => (
                <li
                  key={id}
                  className="border-2 size-24 border-text-primary border-l-0 overflow-hidden"
                >
                  <img src={getAgentSquareImage(id)} className="block w-full" alt="" />
                </li>
              )),
              toArray
            )}
          </ul>
        </div>
      )}
      <div className="flex-1">
        <UI.Typo.Heading className="text-xl" primary>
          Ban
        </UI.Typo.Heading>
        <ul className="flex border-l-2 border-text-primary mt-4">
          {pipe(
            banList,
            zipWithIndex,
            map(([index, id]) => (
              <li key={index} className="border-2 size-24 border-text-primary border-l-0">
                <AgentCard id={id} index={index} />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
    </div>
  )
}

export default Ban
