import { createContext, useEffect } from 'react'

type Props = {
  children: React.ReactNode
}

export const Context = createContext<{}>({})

const Provider = (props: Props) => {
  useEffect(() => {
    if (!window.indexedDB) return
  }, [])

  return <Context.Provider value={{}}>{props.children}</Context.Provider>
}

export default Provider
