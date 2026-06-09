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
  agent: Agent
  state: number
  onClick: (id: number) => void
}

const AgentCard: React.FC<Props> = (props) => {
  const isGray = props.state === 0
  const hasWeapon = props.state === 2
  const exclusiveEngine = props.agent.engine && props.agent.engine.length > 0 ? props.agent.engine[0] : null

  const onClickCard = () => {
    props.onClick(props.agent.id)
  }

  return (
    <div
      className="flex flex-col items-center gap-2 relative group cursor-pointer"
      onClick={onClickCard}
    >
      <div className="relative">
        {props.agent.isTeaser && !isGray && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 bg-[var(--color-tertiary)] text-[var(--color-ink)] text-[9px] px-1.5 py-0.5 rounded font-black tracking-wider shadow border border-[var(--color-tertiary)]/20 animate-bounce">
            예정
          </div>
        )}

        <div
          className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 relative ${
            isGray
              ? 'border-[var(--color-netural)]'
              : props.state === 1
              ? 'border-[var(--color-primary)] shadow-md shadow-[var(--color-primary)]/10'
              : 'border-[var(--color-secondary)] shadow-md shadow-[var(--color-secondary)]/10'
          }`}
        >
          <img
            src={props.agent.profile.url}
            alt={props.agent.nameKo}
            className={`w-full h-full object-cover select-none transition-all duration-300 ${
              isGray ? 'grayscale contrast-[0.85] opacity-40' : 'grayscale-0 opacity-100'
            }`}
          />
        </div>

        {hasWeapon && exclusiveEngine && (
          <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full overflow-hidden border border-[var(--color-secondary)] bg-[var(--color-content)] flex items-center justify-center shadow-lg z-10">
            <img
              src={exclusiveEngine.iconUrl || exclusiveEngine.imageUrl}
              alt={exclusiveEngine.nameKo}
              className="w-full h-full object-cover select-none"
            />
          </div>
        )}
      </div>

      <span
        className={`text-xs font-black tracking-wide transition-colors duration-300 ${
          isGray ? 'text-[var(--color-ink)]/35' : 'text-[var(--color-ink)]'
        }`}
      >
        {props.agent.nameKo}
      </span>
    </div>
  )
}

export default AgentCard
