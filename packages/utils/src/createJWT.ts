import { SECRET } from '.'
import * as jose from 'jose'

async function createJWT(payload: Record<string, any>) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // 24시간 후 만료
    .sign(SECRET)
}

export default createJWT
