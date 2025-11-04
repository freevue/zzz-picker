import type { Side } from '@/types'
import { pipe, join, concat } from '@fxts/core'
import { Form } from '@zzz-picker/components/v2'
import { useState } from 'react'

type Props = {
  side: Side
}

const Nickname: React.FC<Props> = (props) => {
  const [value, setValue] = useState('')
  const onChange = (value: string) => {
    setValue(value)
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
