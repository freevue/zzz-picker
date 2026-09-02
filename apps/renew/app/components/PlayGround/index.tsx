import { Dialog } from '..'
import Ban from './Ban'
import Boss from './Boss'
import Pick from './Pick'
import { includes } from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatch } from '~/hooks'
import { PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
}

const ReadyDialog: React.FC = () => {
  const { play } = useMatch()
  const isAllConnected = useMemo(() => {
    return play[Role.A_SIDE].isConnected && play[Role.B_SIDE].isConnected
  }, [play])

  const onWindowReload = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    window.location.reload()
  }

  return (
    <Dialog active={!isAllConnected} className="z-50">
      <div className="w-dvw h-dvh flex-center p-4 bg-base/50">
        <div className="rounded-2xl overflow-hidden shadow-accent card glas mx-auto max-w-lg">
          <div className="p-4">
            <p className="text-ink ft-pre text-2xl font-bold text-center leading-snug">
              잠시만 기다려주세요. <br />
              상대방 유저가 접속 중이 아닙니다.
              <br />
              <br />
              이 화면이 지속될 경우 <br />
              새로고침을 시도해주세요.
            </p>
          </div>
          <button
            onClick={onWindowReload}
            className="w-full block bg-primary text-accent font-black ft-ria text-2xl py-2"
            type="button"
          >
            새로고침
          </button>
        </div>
      </div>
    </Dialog>
  )
}
const Play: React.FC<Props> = (props) => {
  const { currentPlay, match } = useMatch()

  return (
    <>
      <h1 className="text-4xl font-bold text-primary ft-ria fixed left-4 top-4 z-10">
        {currentPlay!.name}
      </h1>
      {match.phase === Phase.COMMON_BOSS_SELECT && <Boss role={props.role} />}
      {includes(match.phase, [Phase.BAN, Phase.BAN_FIX]) && <Ban role={props.role} />}
      {match.phase === Phase.PICK && <Pick role={props.role} />}
      <ReadyDialog />
    </>
  )
}

export default Play
