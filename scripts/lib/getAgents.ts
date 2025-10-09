import { pipe, map, toArray } from '@fxts/core'
import agents from '~/assets/agents.json' with { type: 'json' }
import icons from '~/assets/icons.json'

type AvatarIcons = {
  square_avatar: string
  rectangle_avatar: string
  vertical_painting: string
  vertical_painting_color: string
}

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
