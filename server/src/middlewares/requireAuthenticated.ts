import { StatusCodes } from 'http-status-codes'
import { type Handler } from 'express'

import restError from '../utils/RestError.js'
import { extractJwtFromReq, verifyJwtToken } from '../utils/jwt.js'
import prisma from '../prisma/index.js'
import { type RefreshTokenPayload, type AccessTokenPayload } from '../utils/tokens.js'

const requireAuthenticated: Handler = async (req, res, next) => {
  const token = extractJwtFromReq(req)

  if (!token)
    throw restError({
      code: StatusCodes.UNAUTHORIZED,
      message: 'Authentication required',
    })

  const payload = <AccessTokenPayload | RefreshTokenPayload>await verifyJwtToken(token)

  if (payload.type !== 'access')
    throw restError({
      code: StatusCodes.UNAUTHORIZED,
      message: 'expected access token, got refresh token',
    })

  req.ctx.user = await prisma.user.findUniqueOrThrow({ where: { id: payload.userId } })

  return next()
}

export default requireAuthenticated
