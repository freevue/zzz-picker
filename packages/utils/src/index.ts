export const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'zzz-picker-secret-key')

export { default as getAgentTotalCost } from './getAgentTotalCost'
export { default as getAgentRarity } from './getAgentRarity'
export { default as createUUID } from './createUUID'
export { default as createJWT } from './createJWT'
export { default as verifyJWT } from './verifyJWT'
