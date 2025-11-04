import { useEffect, useState } from 'react'

type Props = {
  children: () => React.ReactNode
  fallback?: React.ReactNode
}

const ClientOnly: React.FC<Props> = (props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{props.children()}</> : <>{props.fallback}</>
}

export default ClientOnly
