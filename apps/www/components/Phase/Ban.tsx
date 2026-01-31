import type { Rols, RoomData } from '.'
import { ROOM_PHASE } from '.'
import { pipe, filter, map, toArray, concat, join, isNull } from '@fxts/core'
import { Typo, Form } from '@zzz-picker/components/v2'
import { BAN_PHASE, type SelectAgent, SOCKET_EVENT } from '@zzz-picker/constant'
import { useStore, useSocket } from '@zzz-picker/provider/hooks'
import { motion, AnimatePresence } from 'motion/react'
import { useMemo, useState, useEffect, useRef } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const Ban: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const [selectedToBan, setSelectedToBan] = useState<number | null>(null)

  const realtime = (props.room.state as any).realtime || {}
  const phase = realtime.banPhase || BAN_PHASE.A_SELECT
  const candidates = realtime.banCandidates || [null, null]
  const bannedList = props.room.state.play.banList

  // Popup & Timer States
  const [popupAgentId, setPopupAgentId] = useState<number | null>(null)
  const [isPopupGrayscale, setIsPopupGrayscale] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const prevListLengthRef = useRef(bannedList.length)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const getAgentPosition = (agentId: number | null) => {
    if (isNull(agentId)) return null
    return agents.get(agentId)?.specialty.id
  }

  // 포지션 그룹 정의 (DB Specialty ID 기준)
  // 딜러: 이상(1), 명파(2), 강공(3)
  const DEALER_IDS = [1, 2, 3]
  // 서포터: 지원(4), 방어(5), 격파(6)
  const SUPPORTER_IDS = [4, 5, 6]

  const getAgentGroup = (specialtyId?: number | null) => {
    if (!specialtyId) return null
    if (DEALER_IDS.includes(specialtyId)) return 'DEALER'
    if (SUPPORTER_IDS.includes(specialtyId)) return 'SUPPORTER'
    return null
  }

  // 허용된 에이전트 목록 (Protected - 서버 데이터 기준)
  const protectedAgents = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents])

  // 전체 선택 가능한 풀 (S급 픽업 & Allow Agent 제외)
  const pool = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isPickup && agent.rarity === 'S'),
      map(([id]) => id),
      // Rule: 허용된 에이전트는 밴 목록에서 아예 제외 (보이지 않음)
      filter((id) => !protectedAgents.includes(id)),
      toArray
    )
  }, [agents, protectedAgents])

  // 비활성화 목록 계산 (Disabled Logic - Position Rule Only)
  const disabledAgents = useMemo(() => {
    // 1. 이미 밴 리스트에 포함된 캐릭터 (중복 선택 불가)
    const list = [...bannedList]

    // 2. 룰: B선수가 선택한(밴한) 캐릭터와 *같은 포지션 그룹*의 캐릭터 선택 불가
    // 딜러(강공, 이상, 명파) <-> 서포터(격파, 지원, 방어)
    if (phase === BAN_PHASE.B_SELECT) {
      const lastBannedId = bannedList[bannedList.length - 1]
      const lastBannedSpecialty = getAgentPosition(lastBannedId)
      const lastBannedGroup = getAgentGroup(lastBannedSpecialty)

      // 풀 전체를 순회하며 그룹이 같은지 확인
      const sameGroupAgents = pool.filter((id) => {
        const agentSpecialty = getAgentPosition(id)
        return getAgentGroup(agentSpecialty) === lastBannedGroup
      })
      list.push(...sameGroupAgents)
    }

    return list
  }, [pool, phase, bannedList, agents])

  const { send } = useSocket()

  const onChange = (banList: SelectAgent[]) => {
    if (!isMyTurn) return

    // Validate if any selected agent is in disabledAgents
    const isInvalid = banList.some((id) => id && disabledAgents.includes(id))
    if (isInvalid) {
      // Create a toast or just ignore? Ignoring is safest for now
      return
    }

    // 실시간 후보군 공유
    send(SOCKET_EVENT.BAN, { confirm: false, banCandidates: banList })

    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          banCandidates: banList,
        },
      } as any,
    })
  }
  const updateBanState = (nextPhase: BAN_PHASE, nextBannedList: any[], nextCandidates: any) => {
    // 밴 종료 시 즉시 페이즈를 전환하지 않고 BAN_PHASE.END 상태로 유지하여 타이머를 돌림
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          banPhase: nextPhase,
          banCandidates: nextCandidates,
        },
        play: {
          ...props.room.state.play,
          banList: nextBannedList,
        },
      } as any,
    })
    setSelectedToBan(null) // 밴 확정 후 초기화
  }

  // 밴 확정 팝업 연출 로직
  useEffect(() => {
    if (bannedList.length > prevListLengthRef.current) {
      const newAgentId = bannedList[bannedList.length - 1]
      setPopupAgentId(newAgentId)
      setIsPopupGrayscale(false)

      setTimeout(() => setIsPopupGrayscale(true), 1500)
      setTimeout(() => setPopupAgentId(null), 3000)
    }
    prevListLengthRef.current = bannedList.length
  }, [bannedList])

  // 페이즈 전환 타이머 로직
  useEffect(() => {
    if (phase === BAN_PHASE.END && countdown === null) {
      setCountdown(5)
    }

    if (countdown !== null && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      // 타이머 종료 시 Host 혹은 Player A가 최종 페이즈 전환 주도 (Host 부재 시 Fallback)
      if (props.role === 'H' || props.role === 'A') {
        props.onUpdate({
          ...props.room,
          state: {
            ...props.room.state,
            realtime: {
              ...props.room.state.realtime,
              phase: ROOM_PHASE.PICK,
            },
          } as any,
        })
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, countdown, props.role])

  const onConfirm = () => {
    let nextPhase = phase
    let nextCandidates = candidates

    if (phase === BAN_PHASE.A_SELECT) {
      nextPhase = BAN_PHASE.B_BAN
    } else if (phase === BAN_PHASE.B_SELECT) {
      nextPhase = BAN_PHASE.A_BAN
    }

    updateBanState(nextPhase, bannedList, nextCandidates)
  }

  const onBanConfirm = () => {
    if (!selectedToBan) return

    // 슬롯 기반 밴 리스트 업데이트
    const nextBannedList = [...bannedList]
    const emptyIndex = nextBannedList.indexOf(null)
    if (emptyIndex !== -1) {
      nextBannedList[emptyIndex] = selectedToBan
    }

    const nextPhase = phase === BAN_PHASE.B_BAN ? BAN_PHASE.B_SELECT : BAN_PHASE.END
    updateBanState(nextPhase, nextBannedList, [null, null])

    // 실시간 확정 이벤트 전송 (Next Phase 포함)
    send(SOCKET_EVENT.BAN, { confirm: true, agentId: selectedToBan, nextPhase })
  }

  const isMyTurn = useMemo(() => {
    if (props.role === 'A') return [BAN_PHASE.A_SELECT, BAN_PHASE.A_BAN].includes(phase)
    if (props.role === 'B') return [BAN_PHASE.B_BAN, BAN_PHASE.B_SELECT].includes(phase)
    return false
  }, [props.role, phase])

  const isSelectionPhase = [BAN_PHASE.A_SELECT, BAN_PHASE.B_SELECT].includes(phase)
  const isBanActionPhase = [BAN_PHASE.B_BAN, BAN_PHASE.A_BAN].includes(phase)

  const isButtonDisabled = () => {
    if (!isMyTurn) return true
    if (isSelectionPhase) return candidates.includes(null)
    if (isBanActionPhase) return !selectedToBan
    return true
  }

  const onConfirmAction = () => {
    if (countdown !== null) return // 타이머 동작 중에는 클릭 방지
    if (isSelectionPhase) onConfirm()
    else if (isBanActionPhase) onBanConfirm()
  }

  // 밴 슬롯 데이터 (최대 2개 고정)
  const displayBannedList = useMemo(() => {
    return [bannedList[0] ?? null, bannedList[1] ?? null]
  }, [bannedList])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-16 text-center">
      <Typo.Heading
        className="heading-2xl md:heading-4xl text-ink mb-12 md:mb-20 min-h-[1.2em]"
        heading={1}
      >
        {countdown !== null
          ? '다음 단계로 이동 중..'
          : isMyTurn
            ? '선택 중..'
            : '선택을 기다리는 중..'}
      </Typo.Heading>

      {/* [TOP] Banned List - 2 Slots */}
      <div className="flex justify-center">
        <Form.Party size="xl" value={displayBannedList as any} />
      </div>

      {/* [MIDDLE] Candidates & Action Button */}
      <div className="my-20 flex items-center flex-col gap-10">
        <Form.Party
          size="xl"
          banAgents={disabledAgents as any}
          filterAgents={protectedAgents as any}
          value={candidates as any}
          onChange={isMyTurn && isSelectionPhase ? onChange : undefined}
          onClick={(id) => {
            if (isBanActionPhase && isMyTurn) {
              setSelectedToBan(id)
            }
          }}
          focusId={selectedToBan || undefined}
          disabledHover
          deleteable={isMyTurn && isSelectionPhase}
        />

        <AnimatePresence>
          {isMyTurn && (
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              className="relative"
            >
              <button
                onClick={onConfirmAction}
                disabled={isButtonDisabled() || countdown !== null}
                className={pipe(
                  [
                    'px-8 py-4',
                    'rounded-2xl',
                    'heading-2xl',
                    'transition-all',
                    'relative',
                    'overflow-hidden',
                    'flex items-center justify-center',
                  ],
                  concat(
                    !(isButtonDisabled() || countdown !== null)
                      ? ['bg-primary text-content cursor-pointer hover:scale-105 shadow-xl']
                      : ['bg-content text-ink opacity-30 cursor-not-allowed']
                  ),
                  join(' ')
                )}
              >
                <Typo.Heading className="z-10 text-center break-keep">
                  {countdown !== null ? `${countdown}s` : '선택 완료'}
                </Typo.Heading>
                {countdown !== null && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-1.5 bg-white/40"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* [BOTTOM] Allow Agents Display - Improved */}
      {protectedAgents.length > 0 && (
        <div className="mt-8 border-t border-ink/10 pt-12 md:pt-16 max-w-2xl mx-auto">
          <div className="flex flex-wrap justify-center items-center gap-4 scale-90 pointer-events-none">
            {pipe(
              protectedAgents,
              map((agentId) => (
                <Form.Party key={agentId} size="sm" value={[agentId]} deleteable={false} />
              )),
              toArray
            )}
          </div>
        </div>
      )}

      {/* [POPUP] Ban Banner Popup */}
      <AnimatePresence>
        {popupAgentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="relative size-64 md:size-[32rem] overflow-hidden rounded-full border-4 md:border-8 border-primary shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] bg-netural/20"
            >
              <motion.img
                src={agents.get(popupAgentId)?.profile.url}
                alt="Ban Target"
                animate={{ filter: isPopupGrayscale ? 'grayscale(100%)' : 'grayscale(0%)' }}
                transition={{ duration: 1 }}
                className="size-full object-cover scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col items-center justify-end pb-12 md:pb-20 px-4">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl md:text-7xl font-black text-white italic tracking-tighter uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,1)]"
                >
                  Banned
                </motion.span>
                <Typo.Heading className="text-xl md:text-3xl text-primary mt-2 uppercase font-black tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {agents.get(popupAgentId)?.nameKo}
                </Typo.Heading>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Ban
