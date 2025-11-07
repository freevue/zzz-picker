import { supabase } from './utils'
import { type RealtimeChannel } from '@supabase/supabase-js'
import { createContext } from 'react'

type Context = {
  channel: RealtimeChannel
}
type Props = {
  children: React.ReactNode
}

const state = {
  channel: supabase.channel(`room:zzz:pick:chanel`, {
    config: {
      broadcast: { self: false },
    },
  }),
}

export const Context = createContext<Context>(state)

const Provider: React.FC<Props> = (props) => {
  return <Context.Provider value={state}>{props.children}</Context.Provider>
}

export default Provider
