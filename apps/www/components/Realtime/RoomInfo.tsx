import { pipe, map, toArray, concat, join } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { motion } from 'motion/react'

type Token = {
  role: Side | 'H'
  token: string
  uuid: string
  nickname: string
}
type Props = {
  list: Token[]
  gameType: string
  onReset: () => void
}

const COMMON_CLASS = [
  'cursor-pointer',
  'flex',
  'items-center',
  'justify-center',
  'flex-1',
  'heading-2xl',
  'h-16',
  'card-2',
  'full',
]
const LinkButton: React.FC<{ children: React.ReactNode; href: string }> = (props) => {
  return (
    <a
      href={props.href}
      className={pipe(['bg-secondary', 'text-ink'], concat(COMMON_CLASS), join(' '))}
    >
      {props.children}
    </a>
  )
}
const CopyButton: React.FC<{ children: React.ReactNode; value: string }> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigator.clipboard.writeText(props.value)
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={pipe(['bg-primary', 'text-content'], concat(COMMON_CLASS), join(' '))}
    >
      {props.children}
    </button>
  )
}

export const RoomInfo: React.FC<Props> = (props) => {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2xl"
      key="links"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <ul className="flex flex-col gap-14">
        {pipe(
          props.list,
          map(({ nickname, role, token }) => {
            const isHost = role === 'H'
            const joinUrl = `${window.location.origin}/realtime/${isHost ? `${props.gameType}/` : ''}${token}`

            return (
              <li key={role} className="">
                <div className="flex items-end gap-4 mb-2">
                  <Typo.Heading className="heading-3xl text-primary" heading={2}>
                    {role == 'H' ? '관전자' : nickname}
                  </Typo.Heading>
                  {role !== 'H' && (
                    <p className="text-ink/70 body-lg font-semibold">플레이어 {role}</p>
                  )}
                </div>
                <div className="flex w-full overflow-hidden gap-4 items-center">
                  <LinkButton href={joinUrl}>접속</LinkButton>
                  <CopyButton value={joinUrl}>링크복사</CopyButton>
                </div>
              </li>
            )
          }),
          toArray
        )}
      </ul>
      <button
        type="button"
        className={pipe(
          ['px-8', 'py-2', 'card-3', 'full', 'block', 'focus:outline-none', 'mx-auto', 'mt-14'],
          concat(['text-ink', 'bg-base', 'cursor-pointer', 'heading-2xl']),
          join(' ')
        )}
        onClick={props.onReset}
      >
        초기화
      </button>
    </motion.div>
  )
}
