import { Form } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { usePlay } from '@zzz-picker/provider/hooks'
import { useMemo } from 'react'

type Props = {
  side: Side
}

const Nickname: React.FC<Props> = (props) => {
  const { state, setState } = usePlay()
  const value = useMemo(() => state.nickname[props.side], [state.nickname, props.side])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      nickname: {
        ...prev.nickname,
        [props.side]: event.target.value,
      },
    }))
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
