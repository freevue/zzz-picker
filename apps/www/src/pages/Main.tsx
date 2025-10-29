import { useStore } from '@/hooks'
import { pipe, zipWithIndex, map, toArray, join, concat, filter } from '@fxts/core'
import { DEFAULT } from '@zzz-picker/constant'
import { motion } from 'motion/react'
import { useMemo } from 'react'

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
        concat(['text-base']),
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
            'rounded-bl-2xl',
            'rounded-tr-2xl',
            'border-2',
            'flex',
            'flex-col',
            'items-center',
            'justify-center',
            'relative',
          ],
          concat(['text-base', 'border-base']),
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
    href: '/original',
    url: '/images/main/1.png',
    title: '정식 로프꾼',
  },
  {
    href: '/legend',
    url: '/images/main/3.png',
    title: '레전드 로프꾼',
  },
  {
    href: '/unlimited',
    url: '/images/main/4.png',
    title: '공허사냥꾼',
  },
]

const Main: React.FC = () => {
  const { gqlAgents } = useStore()
  const allowAgents = useMemo(() => {
    return pipe(
      gqlAgents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      join(',')
    )
  }, [gqlAgents])

  return (
    <div className="size-full bg-gray-900 flex flex-col items-center justify-center gap-10">
      <img src="/images/main/logo.png" alt="logo" className="w-32 block hover:animate-turbo" />
      <div className="flex items-center justify-center gap-10">
        {pipe(
          LINKS,
          zipWithIndex,
          map(([index, link]) => {
            if (link.href === '/unlimited') {
              return (
                <Link key={index} href={link.href} url={link.url} delay={index * 0.2}>
                  {link.title}
                </Link>
              )
            }

            return (
              <Link
                key={index}
                href={`${link.href}?allowAgent=${allowAgents}&banCount=${DEFAULT.BAN_COUNT}`}
                url={link.url}
                delay={index * 0.2}
              >
                {link.title}
              </Link>
            )
          }),
          toArray
        )}
      </div>
    </div>
  )
}

export default Main
