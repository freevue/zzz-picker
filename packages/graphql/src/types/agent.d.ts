import type { GQL_Edges, GQL_Node, GQL_Image, GQL_Rank_DataTypes, GQL_Engine } from '.'

export type GQL_Agent = {
  id: number
  rarity: GQL_Rank_DataTypes
  isTeaser: boolean
  isPickup: boolean
  isAllow: boolean
  color: string
  nameKo: string
  fullNameKo: string | null
  banner: GQL_Image
  profile: GQL_Image
  specialty: {
    id: number
    nameKo: string
  }
  attributes: {
    id: number
    nameKo: string
  }
  engine: GQL_Edges<GQL_Node<GQL_Engine>>
}
export type GQL_AgentList = {
  agentsCollection: GQL_Edges<GQL_Node<GQL_Agent>>
}
