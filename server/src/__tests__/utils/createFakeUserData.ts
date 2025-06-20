// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from '@faker-js/faker'
import { type Prisma } from '@prisma/client'

type OmitOptionals<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}
const createFakeUserData = () => {
  const [firstName, lastName] = [faker.name.firstName(), faker.name.lastName()].map(v =>
    v.trim().toLowerCase()
  )

  const user: OmitOptionals<Prisma.UserCreateInput> = {
    name: faker.name.fullName({ firstName, lastName }),
    email: faker.helpers.unique(faker.internet.email, [firstName, lastName]),
    password: 'Secret123$',
  }

  return user
}

export default createFakeUserData
