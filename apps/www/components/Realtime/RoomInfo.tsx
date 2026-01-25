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
  onReset: () => void
}

const COMON_CLASS = [
  'cursor-pointer',
  'flex',
  'items-center',
  'justify-center',
  'flex-1',
  'overflow-hidden',
  'heading-2xl',
  'h-16',
  'rounded-xl',
]
const LinkButton: React.FC<{ children: React.ReactNode; href: string }> = (props) => {
  return (
    <a
      href={props.href}
      className={pipe(['bg-secondary', 'text-ink'], concat(COMON_CLASS), join(' '))}
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
      className={pipe(['bg-primary', 'text-content'], concat(COMON_CLASS), join(' '))}
    >
      {props.children}
    </button>
  )
}
const RoomInfo: React.FC<Props> = (props) => {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2/4"
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
            const joinUrl = `${window.location.origin}/realtime/join?u=${token}`
            return (
              <li key={role} className="">
                <div className="flex items-end gap-2 mb-2">
                  {role !== 'H' && <p className="text-ink body-lg">플레이어 {role}:</p>}
                  <Typo.Heading className="heading-3xl text-primary" heading={2}>
                    {role == 'H' ? '관전자' : nickname}
                  </Typo.Heading>
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
        className="block cursor-pointer w-1/4 bg-content text-ink heading-2xl h-16 rounded-xl mx-auto mt-14"
        onClick={props.onReset}
      >
        초기화
      </button>
    </motion.div>
  )
}

export default RoomInfo
