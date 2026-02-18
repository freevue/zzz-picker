import { pipe, sort, find, throwIf, isUndefined } from '@fxts/core'
import { BossSelector } from '@zzz-picker/components/realtime'
import {
  type Boss,
  type RoomState,
  type Side,
  SOCKET_EVENT,
  ROOM_PHASE,
} from '@zzz-picker/constant'
import { useStore, useSocket } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'
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
    try {
      return pipe(
        deadlyAssaultList,
        sort((prev, curr) => curr.open.diff(prev.open)),
        find((deadlyAssault) => dayjs(deadlyAssault.open).isBefore(dayjs())),
        throwIf(isUndefined, () => Error('')),
        ({ boss1, boss2, boss3 }) => [boss1.id, boss2.id, boss3.id]
      )
        .map((id) => bossMap.get(id))
        .filter(Boolean) as Boss[]
    } catch {
      return []
    }
  }, [bossMap, deadlyAssaultList])

  const activeIndex = useMemo(() => {
    const selectedBossId = props.room.play.common.boss

    if (!selectedBossId) return undefined

    return bosses.findIndex((b) => b.id === selectedBossId)
  }, [bosses, props.room.play.common.boss])

  const onSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const bossId = Number(event.currentTarget.value)

    props.onUpdate({
      ...props.room,
      play: {
        ...props.room.play,
        common: {
          ...props.room.play.common,
          boss: bossId,
        },
      },
    })

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
