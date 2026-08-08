import CardTitle from '../CardTitle'
import List from './List'
import { some, isNull, every, isNumber } from '@fxts/core'
import { ChevronsRight } from 'lucide-react'
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
      <div className="flex justify-between items-center">
        <List list={proposeAsideBan} />
        <ChevronsRight className="size-10" />
        <List list={selectBsideBanFix} />
      </div>
      <div className="flex mt-4 justify-between items-center">
        <List list={proposeBsideBan} />
        <ChevronsRight className="size-10" />
        <List list={selectAsideBanFix} />
      </div>
    </div>
  )
}

export default Ban
