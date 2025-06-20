import { type Handler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { extractJwtFromReq, verifyJwtToken } from '../../utils/jwt.js'
import restError from '../../utils/RestError.js'
import { type AccessTokenPayload, type RefreshTokenPayload } from '../../utils/tokens.js'

const requireRefreshToken: Handler = async (req, res, next) => {
  const token = extractJwtFromReq(req)

  if (!token)
    throw restError({
      code: StatusCodes.UNAUTHORIZED,
      message: 'refresh token required',
    })

  const payload = <AccessTokenPayload | RefreshTokenPayload>await verifyJwtToken(token)

  if (payload.type !== 'refresh')
    throw restError({
      code: StatusCodes.UNAUTHORIZED,
      message: 'expected refresh token, got access token',
    })

  const { prisma } = req.ctx

  const tokensExists = await prisma.token.count({ where: { id: payload.jti } })
  if (!tokensExists)
    throw restError({
      code: StatusCodes.UNAUTHORIZED,
      message: 'revoked or expired token',
    })

  req.ctx.user = await prisma.user.findUniqueOrThrow({ where: { id: payload.userId } })

  return next()
}

export default requireRefreshToken
