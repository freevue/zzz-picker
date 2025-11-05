import type { Side } from '@/types'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

type Props = {
  side: Side
}

const Nickname: React.FC<Props> = (props) => {
  const [value, setValue] = useState('')
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <Form.Nickname
      placeholder="닉네임을 입력해주세요"
      side={props.side}
      value={value}
      onChange={onChange}
    />
  )
}

export default Nickname
