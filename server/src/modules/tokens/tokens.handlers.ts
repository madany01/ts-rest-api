import { StatusCodes } from 'http-status-codes'
import dayjs from 'dayjs'

import restError from '../../utils/RestError.js'
import { signJwt } from '../../utils/jwt.js'
import {
  type TokenDeletionSchemaType,
  tokenCreationSchema,
  tokenDeletionSchema,
  type TokenCreationSchemaType,
} from './tokens.schemas.js'
import { makeAccessTokenPayload, makeRefreshTokenPayload } from '../../utils/tokens.js'
import requireRefreshToken from '../../middlewares/requireRefreshToken/index.js'
import requireInSchema from '../../middlewares/requireInSchema.js'
import passwords from '../../utils/passwords.js'

import type { Handler } from 'express'

const createTokensPair: Handler[] = [
  requireInSchema(tokenCreationSchema),
  async (req, res) => {
    const { ctx } = req

    const {
      body: { email, password },
    } = ctx.inSchema! as TokenCreationSchemaType

    const { prisma } = ctx

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    })

    if (!(user && (await passwords.compare(password, user.password))))
      throw restError({
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid email/password',
      })

    const refreshPayload = makeRefreshTokenPayload({ userId: user.id })

    const accessToken = await signJwt(makeAccessTokenPayload({ userId: user.id }))
    const refreshToken = await signJwt(refreshPayload)

    await prisma.token.create({
      data: {
        id: refreshPayload.jti,
        expiredAt: dayjs.unix(refreshPayload.exp).toDate(),
        userId: user.id,
      },
    })

    return res.status(StatusCodes.CREATED).json({ refreshToken, accessToken })
  },
]

const deleteAllRefreshTokens: Handler[] = [
  requireRefreshToken,
  async function deleteAllRefreshTokens(req, res) {
    const { prisma } = req.ctx
    const user = req.ctx.user!

    await prisma.token.deleteMany({ where: { userId: user.id } })

    return res.status(StatusCodes.NO_CONTENT).end()
  },
]

const deleteRefreshToken: Handler[] = [
  requireInSchema(tokenDeletionSchema),
  requireRefreshToken,
  async function deleteRefreshToken(req, res) {
    const { params } = req.ctx.inSchema as TokenDeletionSchemaType
    const user = req.ctx.user!
    const { prisma } = req.ctx

    const token = await prisma.token.findUnique({
      where: { id: params.tokenId },
      select: { userId: true },
    })

    if (token?.userId !== user.id)
      throw restError({
        code: StatusCodes.NOT_FOUND,
        message: 'token not found',
      })

    await prisma.token.delete({
      where: { id: params.tokenId },
    })

    return res.status(StatusCodes.NO_CONTENT).end()
  },
]

const createAccessToken: Handler[] = [
  requireRefreshToken,
  async function createAccessToken(req, res) {
    const user = req.ctx.user!

    const accessToken = await signJwt(makeAccessTokenPayload({ userId: user.id }))

    return res.json({ accessToken })
  },
]

const getRefreshTokens: Handler[] = [
  requireRefreshToken,
  async function getRefreshTokens(req, res) {
    const user = req.ctx.user!
    const { prisma } = req.ctx

    const tokens = await prisma.token.findMany({
      where: { userId: user.id },
      select: { id: true, expiredAt: true },
    })

    return res.json(tokens)
  },
]

export {
  createTokensPair,
  createAccessToken,
  deleteAllRefreshTokens,
  deleteRefreshToken,
  getRefreshTokens,
}
