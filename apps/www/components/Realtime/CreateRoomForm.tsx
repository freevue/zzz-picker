import { pipe, concat, join } from '@fxts/core'
import { Typo, Tabs, Form } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { motion } from 'motion/react'
import { useState } from 'react'

const TABS = [
  { label: '정식 로프꾼 경기', value: '/original' },
  { label: '레전드 로프꾼 경기', value: '/legend' },
  { label: '언리미티드(UL) 공허사냥꾼 경기', value: '/unlimited' },
]

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

const CreateRoomForm: React.FC<Props> = (props) => {
  const [league, setLeague] = useState<string>(TABS[0].value)
  const [users, setUsers] = useState<Record<Side, string>>({ A: '', B: '' })

  const onNicknameChange = (side: Side) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers((prev) => ({
      ...prev,
      [side]: event.target.value,
    }))
  }

  return (
    <motion.div
      key="form"
      className="w-3/4 mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <Form onSubmit={props.onSubmit}>
        <Tabs
          list={TABS}
          className="bg-content!"
          value={league}
          onChange={setLeague}
          name="league"
        />
        <div className="flex gap-10 justify-center mt-10">
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
          type="submit"
          className={pipe(
            ['px-4', 'py-2', 'rounded-xl', 'block', 'w-full', 'mt-20', 'focus:outline-none'],
            concat(['text-ink', 'bg-content', 'cursor-pointer', 'heading-3xl']),
            concat(['hover:text-content', 'hover:bg-primary']),
            concat([
              'disabled:cursor-not-allowed',
              'disabled:bg-content/50',
              'disabled:text-ink/50',
            ]),
            join(' ')
          )}
          disabled={!users.A || !users.B}
        >
          채널생성
        </button>
      </Form>
    </motion.div>
  )
}

export default CreateRoomForm
