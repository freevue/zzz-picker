import AgentDialog from './AgentDialog'
import { Plus, Cross } from '@/Icons'
import { useAgent, usePlay, useSetting, useStore } from '@/hooks'
import { pipe, zipWithIndex, map, toArray, join, concat, isNull, findIndex } from '@fxts/core'
import { Button } from '@zzz-picker/components'
import { Typo, Dialog, Form } from '@zzz-picker/components/v2'
import type { SelectAgent } from '@zzz-picker/constant'
import { useState } from 'react'

type Props = {
  id: number
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const AgentButton: React.FC<Props> = (props) => {
  const agent = useAgent(props.id)

  if (!agent) return null

  return (
    <Button
      type="button"
      onClick={props.onClick}
      className={pipe(
        ['size-full', 'flex', 'items-center', 'justify-center', 'group', 'overflow-hidden'],
        concat(['group-first:rounded-bl-2xl', 'group-first:border-r-0']),
        concat(['group-last:rounded-tr-2xl']),
        join(' ')
      )}
    >
      <img
        src={agent.profile.url}
        style={{ backgroundColor: agent.color || 'transparent' }}
        className="block w-full"
        alt={agent.nameKo}
      />
    </Button>
  )
}
const BanButton: React.FC<{ id: number | null; index: number }> = (props) => {
  const { state, setState } = usePlay()
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false)

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentValue = Number(event.currentTarget.value)
    const currentIndex = findIndex((id) => id === currentValue, state.banList)

    setState((prev) => {
      const banList = [...prev.banList]
      const prevValue = banList[props.index]

      if (currentIndex !== props.index) {
        banList[props.index] = currentValue
        banList[currentIndex] = prevValue || null
      }

      return { ...prev, banList }
    })
    setIsAgentDialogOpen(false)
  }
  const onDelete = () => {
    setState((prev) => {
      const banList = [...prev.banList]

      banList[props.index] = null

      return { ...prev, banList }
    })
  }

  return (
    <>
      {isNull(props.id) ? (
        <Button
          type="button"
          onClick={() => setIsAgentDialogOpen(true)}
          className={pipe(
            [
              'size-full',
              'flex',
              'items-center',
              'justify-center',
              'border-2',
              'border-r-1',
              'border-l-1',
              'border-foreground',
              'group',
            ],
            concat([
              'group-first:rounded-bl-2xl',
              'group-first:border-l-2',
              'group-last:border-r-2',
            ]),
            concat(['group-last:rounded-tr-2xl']),
            join(' ')
          )}
        >
          <Plus className="size-12 stroke-foreground group-hover:stroke-secondary" />
        </Button>
      ) : (
        <div
          className={pipe(
            ['size-full', 'relative', 'overflow-hidden'],
            concat(['group-first:rounded-bl-2xl', 'group-first:border-r-0']),
            concat(['group-last:rounded-tr-2xl']),
            join(' ')
          )}
        >
          <Button
            className="absolute top-0 p-1 right-0 group/delete bg-panel rounded-bl-2xl"
            onClick={onDelete}
            value={props.id}
            type="reset"
          >
            <Cross className="size-6 stroke-foreground group-hover/delete:stroke-secondary" />
          </Button>
          <AgentButton id={props.id} onClick={() => setIsAgentDialogOpen(true)} />
        </div>
      )}
      <Dialog isOpen={isAgentDialogOpen} onClose={() => setIsAgentDialogOpen(false)}>
        <AgentDialog onClose={() => setIsAgentDialogOpen(false)} onClick={onAgentClick} />
      </Dialog>
    </>
  )
}

const BanAgent = () => {
  const { loading } = useStore()
  const { state: settingState } = useSetting()
  const { state: playState, setState } = usePlay()

  const onChange = (banList: SelectAgent[]) => {
    setState((prev) => ({ ...prev, banList }))
  }

  if (loading || settingState.banCount === 0) return null

  // console.log(playState)

  return (
    <div className="flex-1 overflow-hidden p-4">
      <Typo.Heading className="heading-2xl text-primary" heading={3}>
        Ban
      </Typo.Heading>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
        <Form.Party
          filterAgents={settingState.allowAgent}
          value={playState.banList}
          onChange={onChange}
          deleteable
        />
      </div>
    </div>
  )
}

export default BanAgent
