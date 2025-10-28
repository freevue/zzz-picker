import { createContext, useEffect, useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
  routes: {
    [key: string]: React.ReactNode
  }
}
type State = {
  path: string
  push: (path: string) => void
}

export const Context = createContext<State>({
  path: '',
  push: () => {},
})

const Provider: React.FC<Props> = (props) => {
  const [path, setPath] = useState(window.location.pathname || '/')
  const push = (path: string) => {
    setPath(path)
    window.history.pushState(null, '', path)
  }
  const Component = useMemo(() => props.routes[path] || props.children, [path, props])

  return <Context.Provider value={{ path, push }}>{Component}</Context.Provider>
}

export default Provider
