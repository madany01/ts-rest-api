import { PrismaClient } from '@prisma/client'

import logger from '../libs/logger.js'
import conf from '../conf/index.js'

const prisma = new PrismaClient({ datasources: { db: { url: conf.db.url } } })

prisma
  .$connect()
  .then(() => logger.info('📀 Prisma connected'))
  .catch(reason => {
    logger.error(`💥 Prisma failed to connect`)
    logger.error(reason)
    process.exit(1)
  })

export default prisma
