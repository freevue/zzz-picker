import { pipe, map, fromEntries, entries, each } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
  routes: {
    [key: string]: React.ReactNode
  }
}
type URL = {
  path?: string
  searchParams: {
    [key: string]: string
  }
}
type State = {
  path: string
  searchParams: Record<string, string>
  push: (path: string) => void
  replace: (url: URL) => void
}

export const Context = createContext<State>({
  path: '',
  searchParams: {},
  push: () => {},
  replace: () => {},
})

const Provider: React.FC<Props> = (props) => {
  const [path, setPath] = useState(window.location.pathname || '/')
  const [searchParams, setSearchParams] = useState(
    pipe(new URLSearchParams(window.location.search), (params) => params.entries(), fromEntries)
  )
  const Component = useMemo(() => props.routes[path] || props.children, [path, props])

  return (
    <Context.Provider
      value={{
        path,
        push: (path: string) => {
          setPath(path)
          window.history.pushState(null, '', path)
        },
        searchParams,
        replace: (url) => {
          const searchParams = new URLSearchParams()

          setPath(url.path || path)
          setSearchParams((prev) => ({ ...prev, ...(url.searchParams || {}) }))

          pipe(
            { ...searchParams, ...(url.searchParams || {}) },
            entries,
            each(([key, value]) => searchParams.set(key, `${value}`))
          )

          window.history.replaceState(null, '', `${url.path || path}?${searchParams.toString()}`)
        },
      }}
    >
      {Component}
    </Context.Provider>
  )
}

export default Provider
