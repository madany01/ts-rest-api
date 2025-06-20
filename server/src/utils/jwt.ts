import jwt from 'jsonwebtoken'
import { type Request } from 'express'

import conf from '../conf/index.js'

function extractJwtFromReq(req: Readonly<Request>) {
  return req.headers.authorization?.split(' ').at(1)
}

async function signJwt(payload: Parameters<typeof jwt.sign>[0]) {
  return jwt.sign(payload, conf.jwt.privateKey, {
    algorithm: 'ES256',
  })
}

async function verifyJwtToken(token: string) {
  return jwt.verify(token, conf.jwt.publicKey)
}

export { signJwt, verifyJwtToken, extractJwtFromReq }
