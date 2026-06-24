import React, { useEffect, useState } from 'react'

type ClientOnlyProps = {
  children: () => React.ReactNode
  fallback?: React.ReactNode
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted ? <>{children()}</> : <>{fallback}</>
}

export default ClientOnly
