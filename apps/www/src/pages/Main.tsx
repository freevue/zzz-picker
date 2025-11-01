import { useStore } from '@/hooks'
import { pipe, zipWithIndex, map, toArray, join, concat, filter } from '@fxts/core'
import { Dialog, Typo } from '@zzz-picker/components'
import { DEFAULT } from '@zzz-picker/constant'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'

type Props = {
  href: string
  url: string
  children: React.ReactNode
  delay: number
}

const Link: React.FC<Props> = (props) => {
  return (
    <motion.a
      initial={{ translateX: 100, opacity: 0 }}
      animate={{ translateX: 0, opacity: 1 }}
      transition={{ duration: 0.2, delay: props.delay }}
      className={pipe(
        ['flex', 'flex-col', 'items-center', 'justify-center', 'gap-1', 'group'],
        concat(['text-foreground']),
        concat([]),
        join(' ')
      )}
      href={props.href}
    >
      <div
        className={pipe(
          [
            'overflow-hidden',
            'p-4',
            'size-48',
            'rounded-bl-4xl',
            'rounded-tr-4xl',
            'border-2',
            'flex',
            'flex-col',
            'items-center',
            'justify-center',
            'relative',
          ],
          concat(['text-foreground', 'border-foreground']),
          concat(['group-hover:border-secondary']),
          join(' ')
        )}
      >
        <img className="block w-full" src={props.url} alt="" />
      </div>
      <span className="text-xl font-extrabold group-hover:text-secondary">{props.children}</span>
    </motion.a>
  )
}

const LINKS = [
  {
    href: (allowAgents?: string) =>
      `/original?allowAgent=${allowAgents}&banCount=${DEFAULT.BAN_COUNT}&totalCost=${DEFAULT.TOTAL_COST}`,
    url: '/images/main/1.png',
    title: '정식 로프꾼',
  },
  {
    href: (allowAgents?: string) =>
      `/legend?allowAgent=${allowAgents}&banCount=${DEFAULT.BAN_COUNT}`,
    url: '/images/main/3.png',
    title: '레전드 로프꾼',
  },
  {
    href: () => '/unlimited',
    url: '/images/main/4.png',
    title: '공허사냥꾼',
  },
]

const Main: React.FC = () => {
  const { gqlAgents } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const allowAgents = useMemo(() => {
    return pipe(
      gqlAgents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      join(',')
    )
  }, [gqlAgents])

  return (
    <>
      <div className="size-full flex flex-col items-center justify-center gap-10">
        <img src="/images/main/logo.png" alt="logo" className="w-32 block hover:animate-turbo" />
        <div className="flex items-center justify-center gap-10">
          {pipe(
            LINKS,
            zipWithIndex,
            map(([index, link]) => (
              <Link
                key={index}
                href={`${link.href(allowAgents)}`}
                url={link.url}
                delay={index * 0.2}
              >
                {link.title}
              </Link>
            )),
            toArray
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="text-foreground/70 text-lg font-bold hover:text-secondary cursor-pointer focus:outline-none"
        >
          룰 설명서
        </button>
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-4 w-2xl">
          <Typo.Heading primary>룰 설명서</Typo.Heading>
          <div className="text-foreground text-lg">
            <p>룰은 정리되면 추가될 예정입니다.</p>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Main
