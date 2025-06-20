// @ts-ignore
import { type PrismaClient, type User } from '@prisma/client'

import { type RefreshTokenPayload } from '../utils/tokens.js'

type RequestContext = {
  prisma: PrismaClient
  inSchema?: unknown
  user?: User
  refreshTokenPayload?: RefreshTokenPayload
}

export default RequestContext
