import { randomUUID } from 'crypto'

import { type User } from '@prisma/client'
import dayjs from 'dayjs'

import conf from '../conf/index.js'

type BaseTokenPayload = {
  type: string
  iat: number
  nbf: number
  exp: number
  userId: User['id']
}

type RefreshTokenPayload = BaseTokenPayload & {
  type: 'refresh'
  jti: string
}

type AccessTokenPayload = BaseTokenPayload & {
  type: 'access'
}

type CreateRefreshTokenProps = Omit<RefreshTokenPayload, 'jti' | 'iat' | 'nbf' | 'exp' | 'type'>
function makeRefreshTokenPayload(payload: CreateRefreshTokenProps): RefreshTokenPayload {
  const now = dayjs()

  const iat = now.unix()
  const nbf = iat
  const exp = now.add(conf.jwt.refreshTokenTtlSecs, 'seconds').unix()

  const jti = randomUUID()

  return {
    type: 'refresh',
    jti,
    iat,
    nbf,
    exp,
    ...payload,
  }
}

type CreateAccessTokenProps = Omit<AccessTokenPayload, 'iat' | 'nbf' | 'exp' | 'type'>
function makeAccessTokenPayload(payload: CreateAccessTokenProps): AccessTokenPayload {
  const now = dayjs()

  const iat = now.unix()
  const nbf = iat
  const exp = now.add(conf.jwt.refreshTokenTtlSecs, 'seconds').unix()

  return {
    type: 'access',
    exp,
    iat,
    nbf,
    ...payload,
  }
}

export { makeAccessTokenPayload, makeRefreshTokenPayload }
export type { BaseTokenPayload, AccessTokenPayload, RefreshTokenPayload }
