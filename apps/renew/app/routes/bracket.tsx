import React, { useEffect, useState } from 'react'
import { MetaFunction } from '@remix-run/node'
import { Bracket, Loading } from '~/components'

export const meta: MetaFunction = () => {
  return [{ title: '토너먼트 대진표 | zzz-picker' }]
}

const BracketPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {isMounted ? <Bracket className="w-full h-full" /> : <Loading />}
    </main>
  )
}

export default BracketPage
