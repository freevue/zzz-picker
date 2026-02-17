import { filter, isNull, pipe, toArray } from '@fxts/core'
import { Host } from '@zzz-picker/components/realtime'
import type { AgentId } from '@zzz-picker/constant'
import { useSetting, usePlay, useSocket } from '@zzz-picker/provider/hooks'

const BanAgent = () => {
  const { state: settingState } = useSetting()
  const { state: playState } = usePlay()
  const { state: socketState } = useSocket()

  if (settingState.banCount === 0) return null

  return (
    <div className="flex-1 p-4">
      <Host.Ban
        banList={playState.banList}
        banCandidates={
          pipe(
            socketState.realtime.banCandidates || [],
            filter((id) => !isNull(id)),
            toArray
          ) as AgentId[]
        }
      />
    </div>
  )
}

export default BanAgent
