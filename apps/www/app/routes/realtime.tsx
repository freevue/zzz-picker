import { Form } from '@zzz-picker/components/v2'
import type { SelectAgent } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { useState } from 'react'

const Router: React.FC = () => {
  const [value, setValue] = useState<[SelectAgent, SelectAgent]>([null, null])
  const { send } = useSocket(({ payload }) => {
    console.log(payload)

    setValue(payload.payload as [SelectAgent, SelectAgent])
  })
  const onChange = (payload: SelectAgent[]) => {
    setValue(payload as [SelectAgent, SelectAgent])
    send({ payload })
  }

  return (
    <div className="size-full flex flex-col items-center justify-center gap-10">
      <Form.Party value={value} onChange={onChange} />
    </div>
  )
}

export default Router
