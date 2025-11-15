import { gql } from '@apollo/client'

export const ENGINE_LIST = gql`
  {
    enginesCollection {
      edges {
        node {
          id
          nameKo: name_ko
          exclusiveAgentId: exclusive_agent_id
          rank
          imageUrl: image_url
          iconUrl: icon_url
        }
      }
    }
  }
`
