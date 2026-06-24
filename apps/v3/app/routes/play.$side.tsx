import { BroadcastStage } from '~/components/BroadcastStage'
import type { Role } from '~/data/match'
import { useParams } from '@remix-run/react'

export default function PlayRoute() {
  const { side } = useParams()
  const role: Role = side?.toLowerCase() === 'b' ? 'B' : 'A'

  return <BroadcastStage role={role} />
}
