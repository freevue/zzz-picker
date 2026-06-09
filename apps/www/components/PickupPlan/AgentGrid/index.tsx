import AgentCard from '../AgentCard'
import React from 'react'

type Agent = {
  id: number
  nameKo: string
  profile: {
    url: string
  }
  rarity: string
  isPickup: boolean
  isTeaser: boolean
  engine?: Array<{
    iconUrl?: string
    imageUrl: string
    nameKo: string
  }>
}

type Props = {
  pickupAgents: Agent[]
  clickStates: Record<number, number>
  onClickAgent: (id: number) => void
}

const AgentGrid: React.FC<Props> = (props) => {
  return (
    <div className="w-full">
      {props.pickupAgents.length === 0 ? (
        <div className="py-12 text-center text-xs text-[var(--color-ink)]/40">
          픽업 캐릭터 정보를 불러오는 중이거나 데이터가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-y-6 gap-x-4 justify-items-center">
          {props.pickupAgents.map((agent) => {
            const state = props.clickStates[agent.id] || 0
            return (
              <AgentCard key={agent.id} agent={agent} state={state} onClick={props.onClickAgent} />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AgentGrid
