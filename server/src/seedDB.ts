import { type Prisma } from '@prisma/client'
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker'

import prisma from './prisma/index.js'
import truncateTables from './__tests__/utils/truncateTables.js'
import passwords from './utils/passwords.js'

type UserCreateData = Prisma.UserCreateInput

async function createFakeUsersData(n = 10): Promise<UserCreateData[]> {
  const sharedPassword = await passwords.hash('Secret123$')

  return new Array(n).fill(null).map(() => {
    const firstName = faker.name.firstName()
    const lastName = faker.name.lastName()
    const name = faker.name.fullName({ firstName, lastName })

    const user: UserCreateData = {
      name,
      email: faker.helpers.unique(faker.internet.email, [firstName, lastName]),
      password: sharedPassword,
    }
    return user
  })
}
type ProductCreateData = Omit<Prisma.ProductCreateInput, 'user'>

function createFakeProductsData(n = 10): ProductCreateData[] {
  return new Array(n).fill(null).map(() => {
    const product: ProductCreateData = {
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
    }
    return product
  })
}

const [, usersData] = await Promise.all([
  truncateTables(prisma, ['User', 'Product', 'Token']),
  createFakeUsersData(5),
])

await prisma.user.createMany({ data: usersData })
const users = await prisma.user.findMany()

await prisma.product.createMany({
  data: createFakeProductsData(5).map(p => ({
    ...p,
    userId: faker.helpers.arrayElement(users).id,
  })),
})

const products = await prisma.product.findMany()
console.log(users)
console.log(products)
