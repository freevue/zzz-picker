export const SECRET = process.env.ROLE_TOKEN_SECRET
export const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export { default as getAgentTotalCost } from './getAgentTotalCost'
export { default as getAgentRarity } from './getAgentRarity'
export { default as createUUID } from './createUUID'
export { default as encryptRole } from './encryptRole'
export { default as decryptRole } from './decryptRole'
