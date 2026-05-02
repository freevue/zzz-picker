import { join, pipe, zipWithIndex, map, toArray, concat } from '@fxts/core'
import { Link } from '@remix-run/react'
import { Typo, Tooltip } from '@zzz-picker/components/v2'
import { STORAGE_KEY } from '@zzz-picker/constant'
import { supabase } from '@zzz-picker/provider'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { Rule, DevLog } from '~/components'
import { LINKS } from '~/constant'

const Main: React.FC = () => {
  useEffect(() => {
    const url = new URL(window.location.href)
    const token = url.searchParams.get('a')

    if (token) {
      // 1. 토큰으로 유저 정보 조회
      supabase
        .from('realtime_user')
        .select('room_id')
        .eq('id', token)
        .single()
        .then(({ data }) => {
          if (data?.room_id) {
            window.location.href = `/realtime/${data.room_id}?a=${token}`
          }
        })
    }
  }, [])

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
          "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)), url('https://images.zzz.freevue.dev/images/background/7ddd5862-142b-48c5-81ac-06cb79d10d6a.webp')",
      }}
    >
      <img src="/images/main/logo.png" alt="logo" className="w-10 block fixed left-10 top-10" />
      <div className="flex gap-2 flex-row fixed left-1/2 bottom-8 -translate-x-1/2">
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
              <Link to={link.href} className="text-center flex flex-col-reverse items-center gap-4 group">
                <div className="flex size-48 items-center justify-center bg-content card p-2">
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
                      '-translate-y-8',
                      'p-4',
                      'bg-content',
                      'card',
                    ],
                    concat(['group-hover:opacity-100', 'group-hover:translate-y-0']),
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
              데이터 초기화
            </button>
          </Tooltip>
        </li>
      </ul>
    </div>
  )
}

export default Main
