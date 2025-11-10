import { pipe, concat, join, map, toArray } from '@fxts/core'
import { Form, Typo, Tabs } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { createUUID, encryptRole } from '@zzz-picker/utils'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

const TABS = [
  { label: '정식 로프꾼 경기', value: '/original' },
  { label: '레전드 로프꾼 경기', value: '/legend' },
  { label: '언리미티드(UL) 공허사냥꾼 경기', value: '/unlimited' },
]

const LinkButton: React.FC<{ children: React.ReactNode; href: string }> = (props) => {
  return (
    <a
      href={props.href}
      className="text-ink flex items-center justify-center flex-1 overflow-hidden bg-secondary heading-xl h-10 rounded-xl"
    >
      {props.children}
    </a>
  )
}
const CopyButton: React.FC<{ children: React.ReactNode; value: string }> = (props) => {
  return (
    <button
      type="button"
      value={props.value}
      className="flex items-center justify-center flex-1 overflow-hidden bg-primary text-content heading-xl h-10 rounded-xl"
    >
      {props.children}
    </button>
  )
}
const RealtimeRoot: React.FC = () => {
  const [tokens, setTokens] = useState<{ uuid: string; role: Side | 'H'; token: string }[] | null>(
    null
  )
  const [users, setUsers] = useState<Record<Side, string>>({ A: '', B: '' })
  const [league, setLeague] = useState<string>(TABS[0].value)

  const onNicknameChange = (side: Side) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsers((prev) => ({
      ...prev,
      [side]: event.target.value,
    }))
  }
  const onCreateChannel = () => {
    const uuid = createUUID()

    pipe(
      ['A', 'B', 'H'] as const,
      map((role) => ({
        role,
        uuid,
        token: encryptRole(role),
      })),
      toArray,
      (list) => setTokens(list)
    )
  }

  return (
    <AnimatePresence>
      {tokens === null ? (
        <motion.div
          key="form"
          className="w-3/4 mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Tabs list={TABS} className="bg-content!" value={league} onChange={setLeague} />
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
            type="button"
            onClick={onCreateChannel}
            className={pipe(
              ['text-ink', 'px-4', 'py-2', 'rounded-xl', 'block', 'w-full', 'mt-20'],
              concat(['bg-content', 'cursor-pointer', 'heading-3xl']),
              concat(['hover:text-content', 'hover:bg-primary']),
              concat([
                'focus:outline-none',
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
        </motion.div>
      ) : (
        <motion.ul
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3/4 flex flex-col gap-8"
          key="links"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          {pipe(
            tokens,
            map(({ role, token, uuid }) => (
              <li key={token} className="flex w-full overflow-hidden gap-4 items-center">
                <Typo.Heading className="heading-2xl text-ink flex-1 text-center" heading={2}>
                  {role} 채널
                </Typo.Heading>
                <LinkButton href={`${window.location.origin}/realtime/${uuid}?a=${token}`}>
                  접속
                </LinkButton>
                <CopyButton value={token}>링크복사</CopyButton>
              </li>
            )),
            toArray
          )}
        </motion.ul>
      )}
    </AnimatePresence>
  )
}

export default RealtimeRoot
