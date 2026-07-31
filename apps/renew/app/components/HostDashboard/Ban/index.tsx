import CardTitle from '../CardTitle'
import List from './List'
import { Icon } from '@/components'
import {
  map,
  pipe,
  toArray,
  transpose,
  includes,
  last,
  some,
  isNull,
  every,
  isNumber,
} from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatch } from '~/hooks'

const Ban: React.FC = () => {
  const { match, play, select } = useMatch()
  const proposeAsideBan = useMemo(() => {
    if (some(isNull, play[Role.A_SIDE].proposeBan)) return select[Phase.BAN]

    return play[Role.A_SIDE].proposeBan
  }, [play, select])
  const proposeBsideBan = useMemo(() => {
    if (
      every(isNumber, play[Role.A_SIDE].proposeBan) &&
      every(isNumber, play[Role.B_SIDE].selectBan) &&
      some(isNull, play[Role.B_SIDE].proposeBan)
    )
      return select[Phase.BAN]

    return play[Role.B_SIDE].proposeBan
  }, [play, select])
  const selectBsideBanFix = useMemo(() => {
    if (every(isNumber, play[Role.A_SIDE].proposeBan) && some(isNull, play[Role.B_SIDE].selectBan))
      return select[Phase.BAN_FIX]

    return play[Role.B_SIDE].selectBan
  }, [play, select])
  const selectAsideBanFix = useMemo(() => {
    if (
      every(isNumber, play[Role.A_SIDE].proposeBan) &&
      every(isNumber, play[Role.B_SIDE].selectBan) &&
      every(isNumber, play[Role.B_SIDE].proposeBan) &&
      some(isNull, play[Role.A_SIDE].selectBan)
    )
      return select[Phase.BAN_FIX]

    return play[Role.A_SIDE].selectBan
  }, [play, select])

  return (
    <div className="">
      <CardTitle active={match.phase === Phase.BAN}>Ban</CardTitle>
      <div className="flex justify-between">
        <List list={proposeAsideBan} />
        <Icon.Arrow className="rotate-180 block w-20 scale-75" />
        <List list={selectBsideBanFix} />
      </div>
      <div className="flex mt-4 justify-between">
        <List list={proposeBsideBan} />
        <Icon.Arrow className="rotate-180 block w-20 scale-75" />
        <List list={selectAsideBanFix} />
      </div>
    </div>
  )
}

export default Ban
