import { gql } from '@apollo/client'

export const DEADLY_ASSAULT_LIST = gql`
  {
    deadlyAssault: deadly_assaultCollection {
      edges {
        node {
          version
          openAt: open_at
          boss1: boss_1
          boss2: boss_2
          boss3: boss_3
        }
      }
    }
  }
`
