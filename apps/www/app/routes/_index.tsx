import { join, pipe, zipWithIndex, map, toArray, concat } from '@fxts/core'
import { Link } from '@remix-run/react'
import { Typo, Tooltip } from '@zzz-picker/components/v2'
import { STORAGE_KEY } from '@zzz-picker/constant'
import { motion } from 'motion/react'
import { Rule, DevLog } from '~/components'
import { LINKS } from '~/constant'

const Main: React.FC = () => {
  const onResetClick = () => {
    window.localStorage.removeItem(`zzz-picker-dialog-open`)
    window.localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  return (
    <div
      className="size-full flex flex-col items-center justify-center gap-10 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url('https://images.zzz.freevue.dev/images/background/1d986a52-eecd-4077-8029-ce027a551cd2.jpg')",
      }}
    >
      <img src="/images/main/logo.png" alt="logo" className="w-10 block fixed left-10 top-10" />
      <div className="flex flex-col gap-4 fixed left-10 top-1/2 -translate-y-1/2">
        {pipe(
          LINKS,
          zipWithIndex,
          map(([index, link]) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <Link to={link.href} className="text-center flex items-center gap-6 group">
                <div className="flex size-48 items-center justify-center bg-content rounded-bl-4xl rounded-tr-4xl overflow-hidden p-2">
                  <img
                    src={link.url}
                    alt={link.title}
                    className="block w-full group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div
                  className={pipe(
                    [
                      'opacity-0',
                      'transition-all',
                      'duration-300',
                      '-translate-x-8',
                      'p-4',
                      'bg-content',
                      'rounded-bl-3xl',
                      'rounded-tr-3xl',
                    ],
                    concat(['group-hover:opacity-100', 'group-hover:translate-x-0']),
                    join(' ')
                  )}
                >
                  <Typo.Heading className="heading-2xl text-ink">{link.title}</Typo.Heading>
                </div>
              </Link>
            </motion.div>
          )),
          toArray
        )}
      </div>
      <ul className="flex gap-6 fixed bottom-0 right-10 py-5">
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
              데이터 초기화
            </button>
          </Tooltip>
        </li>
      </ul>
    </div>
  )
}

export default Main
