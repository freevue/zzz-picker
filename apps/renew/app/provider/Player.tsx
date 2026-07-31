import { createContext } from 'react'

type Props = {
  children: React.ReactNode
}
type State = {}

export const Context = createContext<State>({})

const PlayState: React.FC<Props> = (props) => {
  return <Context.Provider value={{}}>{props.children}</Context.Provider>
}

export default PlayState
