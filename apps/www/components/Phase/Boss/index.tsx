import { BossSelector } from '@zzz-picker/components/realtime'
import {
  type Boss,
  type RoomState,
  type Side,
  SOCKET_EVENT,
  ROOM_PHASE,
} from '@zzz-picker/constant'
import { useStore, useSocket } from '@zzz-picker/provider/hooks'
import { useMemo } from 'react'

type Props = {
  role: Side | 'H'
  room: RoomState
  onUpdate: (data: RoomState) => void
}

const BossSelect: React.FC<Props> = (props) => {
  const { boss: bossMap, deadlyAssaultList } = useStore()
  const { send } = useSocket()

  const bosses = useMemo(() => {
    const currentAssault = deadlyAssaultList[0]
    if (!currentAssault) return []

    const allowedIds = [currentAssault.boss1.id, currentAssault.boss2.id, currentAssault.boss3.id]
    return allowedIds.map((id) => bossMap.get(id)).filter(Boolean) as Boss[]
  }, [bossMap, deadlyAssaultList])

  const activeIndex = useMemo(() => {
    const selectedBossId = props.room.play.common.boss

    if (!selectedBossId) return undefined

    return bosses.findIndex((b) => b.id === selectedBossId)
  }, [bosses, props.room.play.common.boss])

  const onSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const bossId = Number(event.currentTarget.value)

    send(SOCKET_EVENT.BOSS, {
      confirm: false,
      bossId,
      roundKey: 'common',
    })
  }

  const onSubmit = () => {
    const selectedBossId = props.room.play.common.boss
    if (!selectedBossId) return

    send(SOCKET_EVENT.BOSS, {
      confirm: true,
      bossId: selectedBossId,
      roundKey: 'common',
      nextPhase: ROOM_PHASE.BAN,
    })
  }

  return (
    <BossSelector
      list={bosses}
      active={activeIndex}
      disabled={props.role !== 'B'}
      onSelect={onSelect}
      onSubmit={onSubmit}
      title={props.role === 'B' ? '공용 무대를 선택해주세요.' : '공용 무대 선택을 기다립니다.'}
    />
  )
}

export default BossSelect
