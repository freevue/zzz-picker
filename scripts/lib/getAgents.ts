import agents from '../assets/agents.json' with { type: 'json' }
import icons from '../assets/icons.json' with { type: 'json' }
import { pipe, map, toArray } from '@fxts/core'

type AvatarIcons = {
  square_avatar: string
  rectangle_avatar: string
  vertical_painting: string
  vertical_painting_color: string
}

// pipe(
//   'https://comm-api.game.naver.com/nng_main/v1/game/db/character/GM_NCR_007033/dataType/photo?offset=0&limit=50',
//   fetch,
//   (response) => response.json(),
//   ({ result }) => {
//     console.log(result.character)
//   }
// )

function getAgents() {
  const { avatar_icon } = icons as { avatar_icon: Record<string, AvatarIcons> }

  return pipe(
    agents,
    map((agent) => ({
      isTeaser: agent.is_teaser,
      isUp: agent.is_up,
      name: agent.avatar.name_mi18n,
      fullName: agent.avatar.full_name_mi18n,
      id: agent.avatar.id,
      rarity: agent.avatar.rarity,
    })),
    map((agent) => ({
      ...agent,
      images: {
        square: avatar_icon[`${agent.id}`].square_avatar || '',
        rectangle: avatar_icon[`${agent.id}`].rectangle_avatar || '',
        vertical: avatar_icon[`${agent.id}`].vertical_painting || '',
        color: avatar_icon[`${agent.id}`].vertical_painting_color || '',
      },
    })),
    toArray
  )
}

export default getAgents
