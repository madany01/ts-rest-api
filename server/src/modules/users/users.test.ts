import { afterEach, describe, expect, it, test } from 'vitest'
import request from 'supertest'
import { faker } from '@faker-js/faker'

import app from '../../app.js'
import prisma from '../../prisma/index.js'
import { jsonify } from '../../__tests__/utils/index.js'
import truncateTables from '../../__tests__/utils/truncateTables.js'
import createFakeUserData from '../../__tests__/utils/createFakeUserData.js'
import { type UserCreationSchemaType } from './users.schemas.js'

afterEach(async () => {
  await truncateTables(prisma, ['User'])
})

const agent = request(app)

describe('POST /users', () => {
  describe('returns 400 when passing invalid payload', () => {
    test('missing fields', async () => {
      const payload = createFakeUserData()

      const res = await await agent.post('/api/users').send(payload)

      expect(res.status).toBe(400)
      expect(res.body.errors[0]).toMatchObject({
        code: 'invalid_type',
        expected: 'string',
        message: 'Required',
        path: ['body', 'passwordConfirmation'],
        received: 'undefined',
      })
    })

    test('invalid email', async () => {
      const payload = {
        ...createFakeUserData(),
        passwordConfirmation: '',
        email: 'not valid @email .test',
      }
      payload.passwordConfirmation = payload.password

      const res = await agent.post('/api/users').send(payload).expect(400)

      expect(res.body.errors[0].path).toEqual(['body', 'email'])
    })
  })

  it('responds with 201 and user when valid payload', async () => {
    const payload: UserCreationSchemaType['body'] = {
      name: 'ah',
      email: 'ah@email.test',
      password: 'Secret123$',
      passwordConfirmation: 'Secret123$',
    }
    const resp = await agent.post('/api/users').send(payload).expect(201)

    expect(resp.body).toEqual({
      createdAt: expect.any(String),
      email: 'ah@email.test',
      id: expect.any(String),
      name: 'ah',
      updatedAt: expect.any(String),
    })
  })

  it('return 409 when duplicate email', async () => {
    const payload: UserCreationSchemaType['body'] = {
      name: 'ah',
      email: 'ah@email.test',
      password: 'Secret123$',
      passwordConfirmation: 'Secret123$',
    }
    await agent.post('/api/users').send(payload)

    const res = await agent.post('/api/users').send(payload).expect(409)

    expect(res.body).toContain({
      errorCode: 'P2002',
      message: 'Unique constraint violated',
    })
  })
})

describe('GET /users', () => {
  it('returns all users in db omitting confidential info like email/password', async () => {
    await prisma.user.createMany({ data: new Array(3).fill(null).map(() => createFakeUserData()) })
    const users = await prisma.user.findMany()

    const res = await agent.get('/api/users')

    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(users.length)

    expect(res.body).toEqual(
      users
        .map(({ password, email, ...u }) => u)
        .map(({ createdAt, updatedAt, ...u }) => ({
          ...u,
          updatedAt: updatedAt.toISOString(),
          createdAt: createdAt.toISOString(),
        }))
    )
  })
})

describe('GET /users/:userId', () => {
  it('rejects with 400 when :userId is not uuid', async () => {
    const res = await agent.get('/api/users/123').expect(400)

    expect(res.body.errors[0]).toMatchObject({
      message: 'Invalid uuid',
      path: ['params', 'userId'],
    })
  })

  it('throws 404 when not exists', async () => {
    await agent.get(`/api/users/${faker.datatype.uuid()}`).expect(404)
  })

  it('returns 200 with user data excluding email/password', async () => {
    const user = await prisma.user.create({
      data: createFakeUserData(),
    })

    const { body } = await agent.get(`/api/users/${user.id}`).expect(200)

    const { email, password, ...userNoEmailPass } = user

    expect(body).toEqual(jsonify(userNoEmailPass))
  })

  describe.todo('when caller is the owner', () => {
    it('returns 200 with user data excluding password')
  })
})
