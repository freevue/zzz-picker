import { pipe, concat, join } from '@fxts/core'
import { Form, Typo } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { useState } from 'react'

const RealtimeRoot: React.FC = () => {
  const [users, setUsers] = useState<Record<Side, string>>({ A: '', B: '' })

  const onNicknameChange = (side: Side) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers((prev) => ({
      ...prev,
      [side]: event.target.value,
    }))
  }
  const onCreateChannel = () => {
    console.log('onCreateChannel')
  }

  return (
    <>
      <div className="flex gap-20 justify-center mt-10">
        <div>
          <Typo.Heading className="heading-4xl text-ink mb-4" heading={2}>
            A 플레이어
          </Typo.Heading>
          <Form.Nickname
            side="A"
            value={users.A}
            onChange={onNicknameChange('A')}
            placeholder="닉네임을 입력해주세요"
          />
        </div>
        <div>
          <Typo.Heading className="heading-4xl text-ink text-right mb-4" heading={2}>
            B 플레이어
          </Typo.Heading>
          <Form.Nickname
            side="B"
            value={users.B}
            onChange={onNicknameChange('B')}
            placeholder="닉네임을 입력해주세요"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onCreateChannel}
        className={pipe(['text-ink', 'px-4', 'py-2', 'rounded-md'], concat([]), join(' '))}
        disabled={!users.A || !users.B}
      >
        채널생성
      </button>
    </>
  )
}

export default RealtimeRoot
