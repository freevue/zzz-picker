export type GQL_Edges<T> = {
  edges: Array<T>
}
export type GQL_Node<T> = {
  node: T
}
export type GQL_Rank_DataTypes = 'S' | 'A' | 'B'

export * from './agent'
export * from './engine'
export * from './image'
export * from './attribute'
export * from './boss'
export * from './deadlyAssault'
