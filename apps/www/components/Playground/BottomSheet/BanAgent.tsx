import { Typo, Form } from '@zzz-picker/components/v2'
import type { SelectAgent } from '@zzz-picker/constant'
import { usePlay, useSetting, useStore } from '@zzz-picker/provider/hooks'

const BanAgent = () => {
  const { loading } = useStore()
  const { state: settingState } = useSetting()
  const { state: playState, setState } = usePlay()

  const onChange = (banList: SelectAgent[]) => {
    setState((prev) => ({ ...prev, banList }))
  }

  if (loading || settingState.banCount === 0) return null

  return (
    <div className="flex-1 overflow-hidden p-4">
      <Typo.Heading className="heading-2xl text-primary" heading={3}>
        Ban
      </Typo.Heading>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
        <Form.Party
          filterAgents={settingState.allowAgent}
          value={playState.banList}
          onChange={onChange}
          deleteable
        />
      </div>
    </div>
  )
}

export default BanAgent
