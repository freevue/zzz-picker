import { SECRET } from '.'
import * as jose from 'jose'

async function verifyJWT(token: string) {
  return await jose.jwtVerify(token, SECRET)
}

export default verifyJWT
