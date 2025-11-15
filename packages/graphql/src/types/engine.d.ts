import type { GQL_Edges, GQL_Node, GQL_Rank_DataTypes } from '.'
import type { EngineInfo } from '@zzz-picker/constant'

export type GQL_Engine = EngineInfo
export type GQL_EngineList = {
  enginesCollection: GQL_Edges<GQL_Node<GQL_Engine>>
}
