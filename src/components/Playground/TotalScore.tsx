import { UI } from '@/components'
import { useScore, usePlay, useSetting } from '@/hooks'
import type { Side } from '@/types'
import { pipe, join, concat } from '@fxts/core'
import { useEffect, useState } from 'react'

type Props = {}

const Record: React.FC<{ children: React.ReactNode; className?: string }> = (props) => {
  return (
    <p
      className={pipe(
        ['dark:text-text-primary', 'text-3xl', 'font-black', 'flex-1'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {props.children}
    </p>
  )
}
const TotalScore: React.FC<Props> = (props) => {
  return (
    <div>
      <UI.Typo.Heading className="text-center" primary>
        결과
      </UI.Typo.Heading>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between">
          <Record className="text-right">0</Record>
          <UI.Typo.Heading className="w-1/3 text-xl text-center">총 사용 Cost</UI.Typo.Heading>
          <Record className="text-left">0</Record>
        </div>
        <div className="flex items-center justify-between">
          <Record className="text-right">0</Record>
          <UI.Typo.Heading className="w-1/3 text-xl text-center">라운드 점수 합산</UI.Typo.Heading>
          <Record className="text-left">0</Record>
        </div>
        <div className="flex items-center justify-between">
          <Record className="text-right">0</Record>
          <UI.Typo.Heading className="w-1/3 text-xl text-center">시간 보너스</UI.Typo.Heading>
          <Record className="text-left">0</Record>
        </div>
        <div className="flex items-center justify-between mt-4">
          <UI.Typo.Heading className="flex-1 text-right" primary>
            0
          </UI.Typo.Heading>
          <UI.Typo.Heading className="w-1/3 text-center">총 점수</UI.Typo.Heading>
          <UI.Typo.Heading className="flex-1 text-left" primary>
            0
          </UI.Typo.Heading>
        </div>
      </div>
    </div>
  )
}

export default TotalScore
