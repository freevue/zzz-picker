import type { GQL_Edges, GQL_Node } from '.'

export type GQL_DeadlyAssault = {
  version: number
  openAt: string
  boss1: string
  boss2: string
  boss3: string
}
export type GQL_DeadlyAssaultList = {
  deadlyAssault: GQL_Edges<GQL_Node<GQL_DeadlyAssault>>
}
