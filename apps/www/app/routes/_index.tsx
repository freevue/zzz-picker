import { pipe, zipWithIndex, map, toArray } from '@fxts/core'
import { Link } from '@remix-run/react'
import { Typo, Tooltip } from '@zzz-picker/components/v2'
import { STORAGE_KEY } from '@zzz-picker/constant'
import { motion } from 'motion/react'
import { Rule, DevLog } from '~/components'
import { LINKS } from '~/constant'

const Main: React.FC = () => {
  const onResetClick = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  return (
    <div className="size-full flex flex-col items-center justify-center gap-10">
      <img src="/images/main/logo.png" alt="logo" className="w-32 block hover:animate-turbo" />
      <div className="flex items-center justify-center gap-10">
        {pipe(
          LINKS,
          zipWithIndex,
          map(([index, link]) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <Link to={link.href} className="text-center block group">
                <div className="flex size-48 items-center justify-center bg-content rounded-bl-4xl rounded-tr-4xl overflow-hidden p-2">
                  <img
                    src={link.url}
                    alt={link.title}
                    className="block w-full group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <Typo.Heading className="heading-xl text-primary mt-2">{link.title}</Typo.Heading>
              </Link>
            </motion.div>
          )),
          toArray
        )}
      </div>
      <ul className="flex gap-6 fixed bottom-0 left-1/2 -translate-x-1/2 py-5">
        <li className="border-r border-ink/50 pr-6">
          <Rule />
        </li>
        <li className="border-r border-ink/50 pr-6">
          <DevLog />
        </li>
        <li>
          <Tooltip
            placement="top"
            tip={
              <Typo.Body className="body-sm">
                로컬에 저장된 데이터를 삭제하고 초기 상태로 되돌립니다.
              </Typo.Body>
            }
          >
            <button
              className="text-ink/70 body-lg hover:text-primary cursor-pointer focus:outline-none"
              type="button"
              onClick={onResetClick}
            >
              로컬 저장 데이터 초기화
            </button>
          </Tooltip>
        </li>
      </ul>
    </div>
  )
}

export default Main
