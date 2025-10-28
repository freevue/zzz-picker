import type { GQL_Edges, GQL_Node, GQL_Image } from '.'

export type GQL_Agent = {
  id: null
  rarity: 'S' | 'A'
  isTeaser: boolean
  isPickup: boolean
  isAllow: boolean
  color: string
  nameKo: string
  fullNameKo: string | null
  banner: GQL_Image
  profile: GQL_Image
}
export type GQL_AgentList = {
  agentsCollection: GQL_Edges<GQL_Node<GQL_Agent>>
}
