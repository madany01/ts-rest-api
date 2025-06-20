import supertest from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'

import prisma from '../../prisma/index.js'
import app from '../../app.js'
import truncateTables from '../../__tests__/utils/truncateTables.js'

const agent = supertest(app)

const getUser = async (iden?: string) => {
  return prisma.user.create({
    data: {
      name: 'test user',
      email: `testuser${iden ?? ''}@email.com`,
      password: '.',
    },
  })
}

afterEach(async () => {
  await truncateTables(prisma, ['User'])
})

describe('product', () => {
  describe('get (single)', () => {
    it('returns 404 when no product exists', async () => {
      await agent.get(`/api/products/${12345}`).expect(404)
    })

    it('returns 200 and the products when exists', async () => {
      const user = await getUser()

      const product = await prisma.product.create({
        data: { userId: user.id, title: 'product123123', description: 'dd', price: 22 },
      })

      const resp = await agent.get(`/api/products/${product.id}`)

      expect(resp.statusCode).toBe(200)
      expect(resp.body.title).toEqual(product.title)
    })
  })
})
