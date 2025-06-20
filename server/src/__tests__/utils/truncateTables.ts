import { type PrismaClient } from '@prisma/client'

const TableName = ['User', 'Token', 'Product'] as const

async function truncateTables(prisma: PrismaClient, tables?: Array<(typeof TableName)[number]>) {
  const qryTables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  const dbTables = qryTables
    .map(({ tablename }) => tablename)
    .filter(name => name !== '_prisma_migrations')

  let toBeDeletedTables = dbTables
  if (tables?.length) {
    const tablesSet = new Set<string>(tables)
    toBeDeletedTables = dbTables.filter(tn => tablesSet.has(tn))
  }

  try {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${toBeDeletedTables.map(name => `"public"."${name}"`).join(', ')} CASCADE;`
    )
  } catch (error) {
    console.error({ error })
  }
}

export default truncateTables
