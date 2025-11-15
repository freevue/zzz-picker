import type { GQL_Edges, GQL_Node, GQL_Rank_DataTypes } from '.'

export type GQL_Engine = {
  id: number
  nameKo: string
  exclusiveAgentId: number
  rank: GQL_Rank_DataTypes
  imageUrl: string
  iconUrl: string
}
export type GQL_EngineList = {
  enginesCollection: GQL_Edges<GQL_Node<GQL_Engine>>
}
