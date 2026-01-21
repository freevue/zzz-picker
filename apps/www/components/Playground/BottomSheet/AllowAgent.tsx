import { Typo, Form } from '@zzz-picker/components/v2'
import { useSetting } from '@zzz-picker/provider/hooks'

const AllowAgent = () => {
  const { state } = useSetting()

  return state.allowAgent.length ? (
    <div className="flex-1 overflow-hidden p-4">
      <Typo.Heading className="heading-3xl text-primary mb-4">Allow Agent</Typo.Heading>
      <div className="w-full overflow-x-auto overflow-y-hidden mt-4">
        <Form.Party size="sm" value={state.allowAgent} />
      </div>
    </div>
  ) : null
}

export default AllowAgent
