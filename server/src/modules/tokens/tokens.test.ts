import { randomInt, randomUUID } from 'crypto'

import { faker } from '@faker-js/faker'
import { afterEach, describe, expect, it, test, vi } from 'vitest'
import request from 'supertest'
import dayjs from 'dayjs'

import createDbUser from '../../__tests__/utils/createDbUser.js'
import app from '../../app.js'
import prisma from '../../prisma/index.js'
import truncateTables from '../../__tests__/utils/truncateTables.js'
import { tokenCreationSchema } from './tokens.schemas.js'
import requireRefreshToken from '../../middlewares/requireRefreshToken/index.js'

import type RequestContext from '../../types/RequestContext.js'

vi.mock('../../middlewares/requireRefreshToken/index.ts', async importActual => {
  return {
    default: vi.fn(((await importActual()) as any).default),
  }
})

const agent = request(app)

afterEach(async () => {
  await truncateTables(prisma, ['User'])
})

describe('POST tokens/', () => {
  it('calls schema to validate the payload', async () => {
    const parseSchema = vi.spyOn(tokenCreationSchema, 'parse')

    const random = { something: randomInt(100) }

    await agent.post('/api/tokens').send(random).expect(400)

    expect(parseSchema).toBeCalledTimes(1)
    expect(parseSchema).toBeCalledWith({
      body: { ...random },
      query: {},
      params: {},
    })
  })

  describe('when payload schema is valid', () => {
    describe('rejection reasons', () => {
      test('raises 401 when no email match', async () => {
        await agent
          .post('/api/tokens')
          .send({ email: faker.internet.email(), password: 'Secret123$' })
          .expect(401)
      })

      test('raises 401 when an email match, but password did not', async () => {
        const { user, password } = await createDbUser()

        const res = await agent
          .post('/api/tokens')
          .send({ email: user.email, password: `${password}X` })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('given valid schema + credentials', () => {
    it('returns access and refresh token', async () => {
      const { user, password } = await createDbUser()

      const res = await agent.post('/api/tokens').send({ email: user.email, password })

      expect(res.body).toEqual({
        refreshToken: expect.any(String),
        accessToken: expect.any(String),
      })
    })

    it('saves refresh token in db', async () => {
      const { user, password } = await createDbUser()

      const tokenPre = await prisma.token.findFirst()
      expect(tokenPre).toBe(null)

      await agent.post('/api/tokens').send({ email: user.email, password })
      const tokenAfter = await prisma.token.findFirst()

      expect(tokenAfter).toMatchObject({ id: expect.any(String) })
    })
  })
})

describe('POST tokens/access', () => {
  it('calls "requireRefreshToken"', async () => {
    const mockedRequireRefresh = vi.mocked(requireRefreshToken)

    await agent.post('/api/tokens/access').set({
      Authorization: 'Bearer 123abc',
    })

    expect(mockedRequireRefresh).toBeCalledTimes(1)

    const req = mockedRequireRefresh.mock.calls[0][0]

    expect(req.headers.authorization).toBe('Bearer 123abc')
  })

  it('returns access token when requireRefreshToken confirms', async () => {
    const { user } = await createDbUser()

    const mockedRequireRefresh = vi.mocked(requireRefreshToken)

    mockedRequireRefresh.mockImplementationOnce((req, res, next) => {
      const ctx = (req as any).ctx as RequestContext
      ctx.user = user
      return next()
    })

    const { body } = await agent.post('/api/tokens/access').set({
      Authorization: 'Bearer XXX',
    })

    expect(body).toMatchObject({
      accessToken: expect.any(String),
    })
  })
})

describe('GET tokens/refresh', () => {
  it('calls requireRefreshToken', async () => {
    const mockedDep = vi.mocked(requireRefreshToken)
    await agent.get('/api/tokens/refresh').set({ authorization: 'Bearer 123' })

    expect(mockedDep).toHaveBeenCalledOnce()
    expect(mockedDep.mock.calls[0][0].headers.authorization).toBe('Bearer 123')
  })

  it('returns all refresh tokens belongs to the owner of the sender of the token', async () => {
    const { user, password } = await createDbUser()

    let res = await agent.post('/api/tokens').send({ email: user.email, password })
    const token1 = res.body.refreshToken

    res = await agent.post('/api/tokens').send({ email: user.email, password })

    res = await agent.get('/api/tokens/refresh').set({
      authorization: `Bearer ${token1}`,
    })

    expect(res.body).toMatchObject([{ id: expect.any(String) }, { id: expect.any(String) }])
  })
})

describe('DELETE tokens/refresh', () => {
  it('deletes all refresh tokens of the current user', async () => {
    const { user, password } = await createDbUser()

    const {
      body: { refreshToken },
    } = await agent.post('/api/tokens').send({ email: user.email, password })

    await agent.post('/api/tokens').send({ email: user.email, password })

    expect(await prisma.token.count()).toBe(2)

    await agent
      .delete('/api/tokens/refresh')
      .set({ authorization: `Bearer ${refreshToken}` })
      .expect(204)

    expect(await prisma.token.count()).toBe(0)
  })

  it('raises 401 when invalid token received', async () => {
    await agent.delete('/api/tokens/refresh').set({ authorization: `Bearer ...` }).expect(401)
  })
})

describe('DELETE tokens/refresh/:tokenId', () => {
  it('calls requireRefreshToken', async () => {
    const uuid = randomUUID()
    await agent.delete(`/api/tokens/refresh/${uuid}`)

    expect(vi.mocked(requireRefreshToken)).toBeCalledTimes(1)
  })

  it('raises 404 when token valid but :tokenId is not owned by the sender user', async () => {
    const { user: evil } = await createDbUser()
    const { user: target } = await createDbUser()

    const targetTokenId = randomUUID()

    await prisma.token.create({
      data: { id: targetTokenId, userId: target.id, expiredAt: dayjs().add(1, 'day').toDate() },
    })

    vi.mocked(requireRefreshToken).mockImplementationOnce((req, res, next) => {
      const ctx = (req as any).ctx as RequestContext
      ctx.user = evil
      return next()
    })

    await agent.delete(`/api/tokens/refresh/${targetTokenId}`).expect(404)
  })

  it('raises 404 when no found', async () => {
    const { user } = await createDbUser()

    const tokenId = randomUUID()

    vi.mocked(requireRefreshToken).mockImplementationOnce((req, res, next) => {
      const ctx = (req as any).ctx as RequestContext
      ctx.user = user
      return next()
    })

    await agent.delete(`/api/tokens/refresh/${tokenId}`).expect(404)
  })

  it('deletes the current token from db if all valid', async () => {
    const { user } = await createDbUser()

    const tokenId = randomUUID()

    await prisma.token.create({
      data: {
        id: tokenId,
        expiredAt: dayjs().add(1, 'd').toDate(),
        userId: user.id,
      },
    })

    vi.mocked(requireRefreshToken).mockImplementationOnce((req, res, next) => {
      const ctx = (req as any).ctx as RequestContext
      ctx.user = user
      return next()
    })

    await agent.delete(`/api/tokens/refresh/${tokenId}`).expect(204)

    expect(await prisma.token.count()).toBe(0)
  })
})
