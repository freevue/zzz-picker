import { gql } from '@apollo/client'

export const ALLOW_AGENT_LIST = gql`
  {
    agentsCollection {
      edges {
        node {
          nameKo: name_ko
        }
      }
    }
  }
`

export const AGENT_LIST = gql`
  fragment Source on sources {
    name
    url
  }
  fragment Image on agent_images {
    url
    description
    sources {
      ...Source
    }
  }

  {
    agentsCollection(first: 9999) {
      edges {
        node {
          id
          rarity
          isTeaser: is_teaser
          isPickup: is_pickup
          isAllow: is_allow
          color
          nameKo: name_ko
          fullNameKo: full_name_ko
          banner: banner_image {
            ...Image
          }
          profile: profile_image {
            ...Image
          }
          specialty {
            id
            nameKo: name_ko
          }
          attributes {
            id
            nameKo: name_ko
          }
          engine: enginesCollection {
            edges {
              node {
                nameKo: name_ko
                exclusiveAgentId: exclusive_agent_id
                rank
                imageUrl: image_url
                iconUrl: icon_url
              }
            }
          }
        }
      }
    }
  }
`
