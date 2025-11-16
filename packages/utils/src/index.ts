export const SECRET = process.env.ROLE_TOKEN_SECRET
export const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export { default as getAgentRarity } from './getAgentRarity'
export { default as createUUID } from './createUUID'
export { default as encryptRole } from './encryptRole'
export { default as decryptRole } from './decryptRole'
export { default as getAgentCost } from './getAgentCost'
export { default as getEngineCost } from './getEngineCost'
export { default as getEngineRarity } from './getEngineRarity'
export { default as getTotalCost } from './getTotalCost'
