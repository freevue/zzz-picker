import { gql } from '@apollo/client'

export const BOSS_LIST = gql`
  fragment Attributes on attributes {
    nameKo: name_ko
    id
  }

  {
    bossCollection(first: 1000) {
      edges {
        node {
          id
          hp
          nameKo: name_ko
          resistance: boss_resistance_attributeCollection {
            edges {
              node {
                attributes {
                  ...Attributes
                }
              }
            }
          }
          weakness: boss_weakness_attributeCollection {
            edges {
              node {
                attributes {
                  ...Attributes
                }
              }
            }
          }
        }
      }
    }
  }
`
