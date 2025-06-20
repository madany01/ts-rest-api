import { randomUUID } from 'crypto'

import { describe, expect, it, vi, beforeEach } from 'vitest'
import dayjs from 'dayjs'

import createDbUser from '../../__tests__/utils/createDbUser.js'
import truncateTables from '../../__tests__/utils/truncateTables.js'
import prisma from '../../prisma/index.js'
import requireRefreshToken from './index.js'
import { RestError } from '../../utils/RestError.js'
import { makeAccessTokenPayload, makeRefreshTokenPayload } from '../../utils/tokens.js'
import { signJwt } from '../../utils/jwt.js'

import type RequestContext from '../../types/RequestContext.js'

beforeEach(async () => {
  await truncateTables(prisma, ['User'])
})

describe('requireRefreshToken', () => {
  it('raises 401 for invalid/missing tokens', async () => {
    const req = { headers: { authorization: '' } } as any

    try {
      await requireRefreshToken(req, {} as any, () => {})
    } catch (e) {
      expect(e).toBeInstanceOf(RestError)
      expect(e.HttpStatusCode).toBe(401)
      expect(e.message).toBe('refresh token required')
    }
  })

  it('rethrows jwt verification errors', async () => {
    const req = { headers: { authorization: 'Bearer *' } } as any
    try {
      await requireRefreshToken(req, {} as any, () => {})
    } catch (e) {
      expect(e.name).toBe('JsonWebTokenError')
    }
  })

  it('rejects any non-refresh token even if it is valid', async () => {
    const token = await signJwt(makeAccessTokenPayload({ userId: randomUUID() }))

    const req = { headers: { authorization: `Bearer ${token}` } } as any

    try {
      await requireRefreshToken(req, {} as any, () => {})
    } catch (e) {
      expect(e).toBeInstanceOf(RestError)
      expect(e.HttpStatusCode).toBe(401)
      expect(e.message).toBe('expected refresh token, got access token')
    }
  })

  it('rejects revoked tokens', async () => {
    const token = await signJwt(makeRefreshTokenPayload({ userId: randomUUID() }))

    const ctx: RequestContext = { prisma }
    const req = { headers: { authorization: `Bearer ${token}` }, ctx } as any

    try {
      await requireRefreshToken(req, {} as any, () => {})
    } catch (e) {
      expect(e).toBeInstanceOf(RestError)
      expect(e.HttpStatusCode).toBe(401)
      expect(e.message).toBe('revoked or expired token')
    }
  })

  describe('when all ok', () => {
    it('set req.ctx.user', async () => {
      const { user } = await createDbUser()
      const tokenPayload = makeRefreshTokenPayload({ userId: user.id })
      const token = await signJwt(tokenPayload)

      await prisma.token.create({
        data: {
          id: tokenPayload.jti,
          expiredAt: dayjs.unix(tokenPayload.exp).toDate(),
          userId: tokenPayload.userId,
        },
      })

      const ctx: RequestContext = { prisma }
      const req = {
        headers: { authorization: `Bearer ${token}` },
        ctx,
      } as any

      await requireRefreshToken(req, {} as any, () => {})

      expect(ctx.user).toEqual(user)
    })
  })
})
