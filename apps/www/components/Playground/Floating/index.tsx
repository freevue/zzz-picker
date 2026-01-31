import Reset from './Reset'
import Save from './Save'
import { pipe, join, concat, isNull, throwIf, split, filter, toArray } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Dialog, Form, Typo } from '@zzz-picker/components/v2'
import { STORAGE } from '@zzz-picker/constant'
import { usePlay, useStore } from '@zzz-picker/provider/hooks'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useRef, useState } from 'react'

const Floating: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false)
  const { save, authCheck } = useStore()
  const { state, cost } = usePlay()
  const onSave = useCallback(
    async (authKey: string) => {
      setIsLoading(true)

      try {
        await pipe(
          authCheck(authKey),
          throwIf(
            (check) => !check,
            () => Error('비밀번호 인증 실패')
          ),
          async () => {
            window.localStorage.setItem(STORAGE.AUTH_KEY, authKey)

            const [gameType] = pipe(
              window.location.pathname,
              split('/'),
              filter((item) => item !== ''),
              filter((item) => item !== 'realtime'),
              toArray
            )

            await save(
              state,
              { A: [...cost.A.entries()], B: [...cost.B.entries()] },
              authKey,
              gameType
            )
          }
        )

        alert('저장되었습니다.')
      } catch {
        alert('비밀번호가 일치하지 않습니다.')

        window.localStorage.removeItem(STORAGE.AUTH_KEY)
      } finally {
        setIsPasswordFormOpen(false)
        setIsLoading(false)
      }
    },
    [state, cost, save, authCheck]
  )

  const onSaveClick = async () => {
    const authKey = window.localStorage.getItem(STORAGE.AUTH_KEY)

    if (isNull(authKey)) return setIsPasswordFormOpen(true)

    await onSave(authKey)
  }

  const onPasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    await pipe(
      new FormData(event.target as HTMLFormElement),
      (formData) => formData.get('password') as string,
      onSave
    )
  }

  return (
    <>
      <div
        className={pipe(['fixed', 'right-4', 'bottom-4'], concat(['group:']), join(' '))}
        onMouseLeave={() => setIsOpen(false)}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    staggerChildren: -0.2,
                    delayChildren: 0.2,
                  },
                },
                exit: {
                  opacity: 0,
                  y: 10,
                  transition: {
                    staggerChildren: -0.2,
                    staggerDirection: -1,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col gap-2 mb-2"
            >
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 10 },
                }}
              >
                <Save onSave={onSaveClick} />
              </motion.li>
              <motion.li
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                  exit: { opacity: 0, y: 10 },
                }}
              >
                <Reset />
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
        <div
          className="size-12 rounded-full bg-primary flex items-center justify-center"
          onMouseEnter={() => setIsOpen(true)}
        >
          <Icons.Plus
            className={pipe(
              ['size-8', 'stroke-content', 'transition-transform', 'duration-200'],
              concat(isOpen ? ['rotate-135'] : []),
              join(' ')
            )}
          />
        </div>
      </div>
      <Dialog
        isOpen={isPasswordFormOpen}
        onClose={() => setIsPasswordFormOpen(false)}
        onOpen={() => inputRef.current?.focus()}
      >
        <Typo.Heading className="heading-3xl mb-2 text-primary" heading={2}>
          사용자 인증
        </Typo.Heading>
        <Form onSubmit={onPasswordSubmit}>
          <Form.Input
            ref={inputRef}
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className={pipe(
              ['border-2', 'border-primary', 'rounded-tr-2xl'],
              concat([
                '[&_input]:text-4xl',
                '[&_input]:text-primary',
                '[&_input]:font-black',
                '[&_input]:w-full',
                '[&_input]:px-5',
                '[&_input]:py-4',
                '[&_input]:placeholder:text-3xl',
                '[&_input]:placeholder:text-ink/50',
              ]),
              join(' ')
            )}
          />
          <button
            type="submit"
            className={pipe(
              ['block', 'w-full', 'h-14', 'heading-xl', 'bg-primary', 'text-tertiary'],
              concat(['rounded-bl-2xl', 'cursor-pointer', 'focus:outline-none']),
              join(' ')
            )}
          >
            인증 후 저장
          </button>
        </Form>
      </Dialog>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={pipe(
              [
                'fixed',
                'left-0',
                'top-0',
                'w-full',
                'h-full',
                'bg-base/70',
                'z-9999',
                'flex',
                'justify-center',
                'items-center',
                'backdrop-blur-lg',
              ],
              join(' ')
            )}
          >
            <div>
              <img src="/images/loading.gif" alt="loading" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Floating
