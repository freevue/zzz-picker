import { pipe, concat, join } from '@fxts/core'
import { Typo, Tabs, Form } from '@zzz-picker/components/v2'
import { motion } from 'motion/react'
import { useState } from 'react'

const TABS = [
  { label: '정식 로프꾼', value: 'original' },
  { label: '레전드 로프꾼', value: 'legend' },
  { label: '공허사냥꾼', value: 'unlimited' },
]

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

export const CreateRoomForm: React.FC<Props> = (props) => {
  const [league, setLeague] = useState<string>(TABS[0].value)

  return (
    <motion.div
      key="form"
      className="w-full h-screen flex justify-center items-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <Form onSubmit={props.onSubmit} className="w-4xl">
        <Tabs
          list={TABS}
          className="bg-content! mx-auto"
          value={league}
          onChange={setLeague}
          name="league"
        />
        <div className="flex gap-10 justify-center items-center my-20">
          <div>
            <Typo.Heading className="heading-4xl text-ink mb-4 text-right" heading={2}>
              A 플레이어
            </Typo.Heading>
            <Form.Nickname side="A" placeholder="닉네임을 입력해주세요" />
          </div>
          <Typo.Heading className="heading-4xl text-primary text-center" heading={2}>
            VS
          </Typo.Heading>
          <div>
            <Typo.Heading className="heading-4xl text-ink text-left mb-4" heading={2}>
              B 플레이어
            </Typo.Heading>
            <Form.Nickname side="B" placeholder="닉네임을 입력해주세요" />
          </div>
        </div>
        <button
          type="submit"
          className={pipe(
            ['px-8', 'py-2', 'card-3', 'full', 'block', 'focus:outline-none', 'mx-auto'],
            concat(['text-ink', 'bg-base', 'cursor-pointer', 'heading-2xl']),
            concat(['hover:text-base', 'hover:bg-primary']),
            join(' ')
          )}
        >
          채널생성
        </button>
      </Form>
    </motion.div>
  )
}
