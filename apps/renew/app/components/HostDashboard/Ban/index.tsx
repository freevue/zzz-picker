import CardTitle from '../CardTitle'
import List from './List'
import { Icon } from '@/components'
import { map, pipe, toArray, transpose, includes, last } from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatchState } from '~/hooks'

const Ban: React.FC = () => {
  const matchState = useMatchState()
  const selectAsideBan = useMemo(() => {
    if (matchState.phase === Phase.BAN_FIX) return matchState.state.proposeBan[Role.A_SIDE]
    if (!includes(null, matchState.state.selectBan[Role.B_SIDE]))
      return matchState.state.proposeBan[Role.A_SIDE]

    return pipe(
      includes(null, matchState.state.proposeBan[Role.A_SIDE]) ? matchState.select.ban : [],
      transpose([null, null]),
      map(last),
      toArray
    )
  }, [matchState])
  const selectBsideBan = useMemo(() => {
    if (matchState.phase === Phase.BAN_FIX) return matchState.state.proposeBan[Role.B_SIDE]
    if (!includes(null, matchState.state.selectBan[Role.A_SIDE]))
      return matchState.state.proposeBan[Role.B_SIDE]

    return pipe(
      includes(null, matchState.state.selectBan[Role.A_SIDE]) ? [] : matchState.select.ban,
      transpose([null, null]),
      map(last),
      toArray
    )
  }, [matchState])
  const selectBsideBanFix = useMemo(() => {
    if (matchState.phase !== Phase.BAN_FIX) return matchState.state.selectBan[Role.B_SIDE]

    if (!includes(null, matchState.state.selectBan[Role.B_SIDE]))
      return matchState.state.selectBan[Role.B_SIDE]

    return pipe(
      includes(null, matchState.state.proposeBan[Role.A_SIDE]) ? [] : matchState.select.banFix,
      transpose([null]),
      map(last),
      toArray
    )
  }, [matchState])
  const selectAsideBanFix = useMemo(() => {
    if (matchState.phase !== Phase.BAN_FIX) return matchState.state.selectBan[Role.A_SIDE]

    if (!includes(null, matchState.state.selectBan[Role.A_SIDE]))
      return matchState.state.selectBan[Role.A_SIDE]

    return pipe(
      includes(null, matchState.state.proposeBan[Role.B_SIDE]) ? [] : matchState.select.banFix,
      transpose([null]),
      map(last),
      toArray
    )
  }, [matchState])

  return (
    <div className="">
      <CardTitle active={matchState.phase === Phase.BAN || matchState.phase === Phase.BAN_FIX}>
        Ban
      </CardTitle>
      <div className="flex justify-between">
        <List list={selectAsideBan} />
        <Icon.Arrow className="rotate-180 block w-20 scale-75" />
        <List list={selectBsideBanFix} />
      </div>
      <div className="flex mt-4 justify-between">
        <List list={selectBsideBan} />
        <Icon.Arrow className="rotate-180 block w-20 scale-75" />
        <List list={selectAsideBanFix} />
      </div>
    </div>
  )
}

export default Ban
