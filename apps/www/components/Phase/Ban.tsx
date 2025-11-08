import { Typo, Form } from '@zzz-picker/components/v2'
import type { SelectAgent } from '@zzz-picker/constant'
import { useState } from 'react'

const Ban: React.FC = () => {
  const [value, setValue] = useState<[SelectAgent]>([null])
  const onChange = (payload: SelectAgent[]) => {
    setValue(payload as [SelectAgent])
  }
  return (
    <div>
      <Typo.Heading className="heading-4xl text-ink" heading={1}>
        캐릭터 2개를 선택하여 밴을 진행해주세요.
      </Typo.Heading>
      <div className="flex gap-20 justify-center mt-10">
        <Form.Party size="xl" value={value} onChange={onChange} />
        <Form.Party size="xl" value={[null]} />
      </div>
      <button className="mt-10">확인</button>
    </div>
  )
}

export default Ban
