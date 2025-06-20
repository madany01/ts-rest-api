import { StatusCodes } from 'http-status-codes'
import { type ErrorRequestHandler } from 'express'
import { Prisma } from '@prisma/client'

import restError from '../utils/RestError.js'

const catchPrismaError: ErrorRequestHandler = (e, _req, res, next) => {
  if (!(e instanceof Prisma.PrismaClientKnownRequestError)) return next(e)

  switch (e.code) {
    case 'P2002':
      throw restError({
        code: StatusCodes.CONFLICT,
        message: 'Unique constraint violated',
        errorCode: e.code,
      })

    default:
      throw restError({
        code: StatusCodes.UNPROCESSABLE_ENTITY,
        errorCode: e.code,
      })
  }
}
export default catchPrismaError
