import BanItem from './BanItem'
import CandiBanList from './CandiBanList'
import { useBanLogic } from './useBanLogic'
import { pipe, map, toArray, filter, sort, concat, join, includes, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { type SelectAgent, type AgentId, BAN_PHASE, type Side } from '@zzz-picker/constant'

type Props = {
  role: Side | 'H'
  banPhase: BAN_PHASE
  banCandidates: AgentId[]
  currentBan: SelectAgent[]
  onSelectAgent?: (agentId: AgentId) => void
  onSubmit?: (selectedBanId: AgentId | null) => void
}

const BanPhase: React.FC<Props> = (props) => {
  const { agents, active, allowSpecialty, isBanPhase, selectedBanId, isSubmitDisabled, handlers } =
    useBanLogic(props)

  const submitLabel = '확인'

  return (
    <div className="size-full flex flex-col gap-4 py-4">
      <div className="px-4">
        <Typo.Heading heading={1} className="heading-4xl text-primary">
          Ban Agents
        </Typo.Heading>
        {/* 현재 Ban이 된 캐릭터들을 보여줍니다. */}
        <ul className="flex gap-2 justify-center my-4">
          {pipe(
            props.currentBan,
            zipWithIndex,
            map(([index, agentId]) => <BanItem key={index} agentId={agentId} />),
            toArray
          )}
        </ul>
      </div>
      {/* 현재 Ban이 가능한 캐릭터들을 리스트업합니다. */}
      <div className="flex-1 overflow-y-auto">
        <ul className="grid grid-cols-4 gap-2 gap-y-6 p-4 w-full max-w-2xl mx-auto">
          {pipe(
            agents,
            map(([, agent]) => agent),
            filter((agent) => agent.rarity === 'S'),
            filter((agent) => agent.isPickup),
            filter((agent) => !agent.isTeaser),
            sort((prev, cur) => prev.nameKo.localeCompare(cur.nameKo)),
            map((agent) => (
              <li key={agent.id}>
                <button
                  type="button"
                  aria-selected={includes(agent.id, props.banCandidates)}
                  value={agent.id}
                  onClick={handlers.onAgentClick}
                  className={pipe(
                    ['block', 'mx-auto', 'cursor-pointer', 'group'],
                    concat([
                      'disabled:opacity-50',
                      'disabled:grayscale',
                      'disabled:cursor-not-allowed',
                    ]),
                    join(' ')
                  )}
                  disabled={
                    !active ||
                    isBanPhase ||
                    agent.isAllow ||
                    (props.banPhase === BAN_PHASE.B_SELECT &&
                      includes(agent.specialty.id, allowSpecialty))
                  }
                >
                  <div
                    style={{ backgroundColor: agent.color || 'transparent' }}
                    className={pipe(
                      ['card-2', 'inverse', 'max-w-24', 'w-full', 'aspect-square', 'ring-2'],
                      concat(['group-aria-selected:ring-primary']),
                      join(' ')
                    )}
                  >
                    <img src={agent.profile.url} alt={agent.nameKo} />
                  </div>
                  <span className="text-sm font-bold mt-1 text-ink">{agent.nameKo}</span>
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {/*
        선택 완료 버튼입니다.
        페이즈에 따라 아래 2개의 역할을 합니다.
        - 밴을 진행할 캐릭터 2개를 제시
        - 제시받은 캐릭터 2개중 하나를 선택하여, 최종 밴을 진행
      */}
      <div className="px-4 w-full max-w-md mx-auto">
        {isBanPhase && (
          <CandiBanList
            list={props.banCandidates}
            activeId={selectedBanId}
            onClick={handlers.onCandidateClick}
          />
        )}
        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={handlers.onSubmit}
          className={pipe(
            [
              'card',
              'py-2',
              'heading-xl',
              'full',
              'w-full',
              'block',
              'bg-primary',
              'text-ink',
              'cursor-pointer',
            ],
            concat(['disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-content']),
            join(' ')
          )}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  )
}

export default BanPhase
