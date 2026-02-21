import AgentGrid from './AgentGrid'
import BossSelectDialog from './BossSelectDialog'
import BossSlot from './BossSlot'
import CostDialog from './CostDialog'
import PartySlotCard from './PartySlotCard'
import { usePickLogic } from './usePickLogic'
import { pipe, concat, join } from '@fxts/core'
import { Tabs, Typo, Dialog } from '@zzz-picker/components/v2'
import {
  type SelectAgent,
  type SelectBoss,
  type AgentId,
  type BossId,
  type Side,
  type AgentCostSetting,
  GAME_TYPE,
} from '@zzz-picker/constant'

type RoundKey = 'personal' | 'common'

type Props = {
  role: Side | 'H'
  gameType?: GAME_TYPE
  pickList: {
    personal: [SelectAgent, SelectAgent, SelectAgent]
    common: [SelectAgent, SelectAgent, SelectAgent]
  }
  pickCost?: {
    personal: [AgentCostSetting | null, AgentCostSetting | null, AgentCostSetting | null]
    common: [AgentCostSetting | null, AgentCostSetting | null, AgentCostSetting | null]
  }
  boss: {
    personal: SelectBoss
    common: SelectBoss
  }
  banList: SelectAgent[]
  onSelectAgent?: (round: RoundKey, index: number, agentId: AgentId) => void
  onRemoveAgent?: (round: RoundKey, index: number) => void
  onSelectBoss?: (round: RoundKey, bossId: BossId) => void
  onCostChange?: (round: RoundKey, index: number, setting: AgentCostSetting) => void
  slotCosts?: {
    personal: [number, number, number]
    common: [number, number, number]
  }
  onSubmit?: () => void
  disabled?: boolean
}

const ROUND_LIST = [
  { value: 'personal', label: '라운드 1' },
  { value: 'common', label: '라운드 2' },
]

const PickPhase: React.FC<Props> = (props) => {
  const {
    round,
    setRound,
    rarity,
    setRarity,
    isBossDialogOpen,
    setIsBossDialogOpen,
    currentPickList,
    currentBoss,
    active,
    isPersonalRound,
    currentSlotCosts,
    selectedInCurrent,
    isCurrentRoundFull,
    otherRoundAgents,
    bannedAgents,
    bossList,
    selectedBossIds,
    isSubmitDisabled,
    selectedAgentForDialog,
    selectedCostForDialog,
    filteredAgents,
    handlers,
  } = usePickLogic(props)

  return (
    <div className="size-full flex flex-col gap-3 sm:gap-4 py-4">
      {/* 타이틀 */}
      <div className="px-4">
        <Typo.Heading heading={1} className="heading-4xl text-primary">
          Pick Agents
        </Typo.Heading>
      </div>

      {/* 라운드 탭 */}
      <div className="px-4">
        <Tabs value={round} className="bg-content" list={ROUND_LIST} onChange={setRound} />
      </div>

      {/* 파티 슬롯 + 보스 슬롯 */}
      <div className="px-4">
        <div
          className={pipe(
            ['flex', 'gap-3', 'justify-center', 'max-w-md', 'mx-auto'],
            concat(['flex-col', 'items-center']),
            concat(['sm:flex-row', 'sm:items-start', 'sm:gap-4']),
            join(' ')
          )}
        >
          {/* 캐릭터 3슬롯 */}
          <div className={pipe(['flex', 'gap-2', 'w-full'], concat(['sm:flex-1']), join(' '))}>
            {currentPickList.map((agentId, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <PartySlotCard
                  agentId={agentId}
                  index={index}
                  cost={currentSlotCosts[index]}
                  onClick={() => handlers.onPartySlotClick(index)}
                />
              </div>
            ))}
          </div>

          {/* 보스 슬롯 */}
          <div className={pipe(['shrink-0'], concat(['w-24', 'sm:w-20']), join(' '))}>
            <BossSlot
              bossId={currentBoss}
              onClick={() => {
                if (active && (isPersonalRound || props.gameType === GAME_TYPE.UNLIMITED)) {
                  setIsBossDialogOpen(true)
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 등급 필터 탭 */}
      <div className="px-4">
        <Tabs
          className="bg-content max-w-xs mx-auto"
          list={['S', 'A']}
          value={rarity}
          onChange={(value) => setRarity(value as any)}
        />
      </div>

      {/* 캐릭터 선택 그리드 */}
      <AgentGrid
        agents={filteredAgents}
        selectedInCurrent={selectedInCurrent}
        otherRoundAgents={otherRoundAgents}
        bannedAgents={bannedAgents}
        active={active}
        isCurrentRoundFull={isCurrentRoundFull}
        onClick={handlers.onAgentClick}
      />

      {/* 선택 완료 버튼 */}
      <div className="px-4 w-full max-w-md mx-auto">
        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={props.onSubmit}
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
          선택 완료
        </button>
      </div>

      {/* CostDialog */}
      <Dialog
        isOpen={selectedAgentForDialog !== null}
        onClose={handlers.onCloseCostDialog}
        closeable
      >
        {selectedAgentForDialog && (
          <CostDialog
            agentId={selectedAgentForDialog}
            costSetting={
              selectedCostForDialog || {
                agentId: selectedAgentForDialog,
                engineId: null,
                agentRate: 0,
                engineRate: 1,
              }
            }
            onCostChange={handlers.onCostChange}
          />
        )}
      </Dialog>

      {/* 보스 선택 Dialog (개인무대 전용) */}
      <BossSelectDialog
        isOpen={isBossDialogOpen}
        onClose={() => setIsBossDialogOpen(false)}
        bossList={bossList}
        currentBoss={currentBoss}
        selectedBossIds={selectedBossIds}
        onSelect={handlers.onBossSelect}
        onSubmit={handlers.onBossSubmit}
      />
    </div>
  )
}

export default PickPhase
