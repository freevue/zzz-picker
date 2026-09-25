import React, { useState } from 'react'
import { pipe, toAsync, toArray, peek, map } from '@fxts/core'
import { Dialog } from '..'
import { insertMatch, insertPlayer, selectAdversityBoss } from '@/lib/DB'
import { BossType, MatchType, Phase, Role } from '~/constant'

type Props = {
  active: boolean
  playerA: string
  playerB: string
  onClose: () => void
}

const MATCH_OPTIONS = [
  { value: MatchType.ORIGINAL, label: '정식 로프꾼' },
  { value: MatchType.LEGEND, label: '레전드 로프꾼' },
  { value: MatchType.UNLIMITED, label: '공허사냥꾼' },
]

const ROUND_OPTIONS = [
  { value: BossType.TRIAL, label: '일반 모드' },
  { value: BossType.ADVERSITY, label: '절망 모드' },
]

const BracketCreateRoom: React.FC<Props> = (props) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const matchType = formData.get('match') as MatchType
      const round = formData.get('round') as BossType
      const nameA = (formData.get(Role.A_SIDE) as string) || props.playerA
      const nameB = (formData.get(Role.B_SIDE) as string) || props.playerB

      const phase =
        matchType === MatchType.UNLIMITED
          ? Phase.PICK
          : round === BossType.ADVERSITY
            ? Phase.BAN
            : Phase.COMMON_BOSS_SELECT

      const { id: matchId } = await insertMatch({ matchType, phase })
      const { id: bossId } = await selectAdversityBoss()

      await pipe(
        [
          { role: Role.A_SIDE, name: nameA },
          { role: Role.B_SIDE, name: nameB },
        ],
        map((item) => ({
          role: item.role,
          name: item.name,
          boss: round === BossType.ADVERSITY ? [null, bossId] : [null, null],
        })),
        toAsync,
        peek(insertPlayer(matchId)),
        toArray
      )

      if (typeof window !== 'undefined') {
        window.open(`/${matchId}`, '_blank')
      }
      props.onClose()
    } catch (error) {
      console.error('방 생성 실패:', error)
      alert('방 생성에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog active={props.active} className="flex items-center justify-center" onClose={props.onClose} bgClose>
      <form className="card rounded-2xl p-8 flex flex-col gap-5 w-screen max-w-lg" onSubmit={onSubmit}>
        <div>
          <p className="text-2xl font-bold ft-pre text-primary mb-3">경기 타입</p>
          <ul className="flex rounded-full overflow-hidden h-11 w-full bg-accent/60 p-1">
            {pipe(
              MATCH_OPTIONS,
              map(({ value, label }) => (
                <li className="flex-1" key={value}>
                  <label className="flex items-center justify-center text-sm font-bold ft-pre rounded-full cursor-pointer h-full has-checked:bg-primary has-checked:text-accent transition-colors">
                    {label}
                    <input className="appearance-none hidden" defaultChecked={MatchType.ORIGINAL === value} type="radio" name="match" value={value} />
                  </label>
                </li>
              )),
              toArray
            )}
          </ul>
        </div>

        <div>
          <p className="text-2xl font-bold ft-pre text-primary mb-3">2Round 보스 모드</p>
          <ul className="flex rounded-full overflow-hidden h-11 w-full bg-accent/60 p-1">
            {pipe(
              ROUND_OPTIONS,
              map(({ value, label }) => (
                <li className="flex-1" key={value}>
                  <label className="flex items-center justify-center text-sm font-bold ft-pre rounded-full cursor-pointer h-full has-checked:bg-primary has-checked:text-accent transition-colors">
                    {label}
                    <input className="appearance-none hidden" defaultChecked={BossType.TRIAL === value} type="radio" name="round" value={value} />
                  </label>
                </li>
              )),
              toArray
            )}
          </ul>
        </div>

        <div>
          <p className="text-2xl font-bold ft-pre text-primary mb-3">대진 참가자 (자동 주입)</p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name={Role.A_SIDE}
              defaultValue={props.playerA}
              placeholder="A선수 닉네임"
              className="h-12 bg-accent/80 rounded-xl px-4 text-ink font-bold ft-pre text-lg outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              name={Role.B_SIDE}
              defaultValue={props.playerB}
              placeholder="B선수 닉네임"
              className="h-12 bg-accent/80 rounded-xl px-4 text-ink font-bold ft-pre text-lg outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-14 ft-pre font-black text-xl px-4 cursor-pointer bg-primary text-[#16181f] rounded-full mt-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '방 생성 중...' : '새 탭에서 경기장 생성'}
        </button>
      </form>
    </Dialog>
  )
}

export default BracketCreateRoom
