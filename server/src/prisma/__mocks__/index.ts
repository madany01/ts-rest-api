import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

prisma.$connect().catch(reason => {
  console.error(`💥 Prisma failed to connect`)
  console.error(reason)
})

export default prisma
