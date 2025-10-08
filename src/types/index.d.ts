export type Pick = {
  agent: number | null
  cost: number
}

export type Side = 'A' | 'B'
export type AgentPick = [Pick, Pick, Pick]

export type AgentAvatar = {
  avatar_profession: number
  awaken_state: string
  camp_name_mi18n: string
  element_type: number
  full_name_mi18n: string
  group_icon_path: string
  hollow_icon_path: string
  id: number
  level: number
  name_mi18n: string
  rank: number
  rarity: string
  sub_element_type: number
}

export type Agent = {
  avatar: AgentAvatar
  unlocked: boolean
  is_up: boolean
  is_teaser: boolean
  is_top: boolean
}
