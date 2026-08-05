import { selectDeadlyAssault, selectAgent, selectEngine } from '@/lib/DB'
import { type Boss, type Agent, type Engine } from '@/type'
import { map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'
import { Loading } from '~/components'
import { BossType } from '~/constant'

type Props = {
  children: React.ReactNode
}
type State = {}

const INITIAL_SETTING = {
  matchs: [BossType.TRIAL, BossType.TRIAL],
}

export const Context = createContext<State>(INITIAL_SETTING)

const Setting: React.FC<Props> = (props) => {
  return <Context.Provider value={INITIAL_SETTING}>{props.children}</Context.Provider>
}

export default Setting
