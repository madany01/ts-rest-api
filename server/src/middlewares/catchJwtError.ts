import { StatusCodes } from 'http-status-codes'
import { type ErrorRequestHandler } from 'express'
import { JsonWebTokenError, type VerifyErrors } from 'jsonwebtoken'

import restError from '../utils/RestError.js'

const whiteListMsgs = [
  'jwt expired',
  'invalid token - the header or payload could not be parse',
  'jwt malformed - the token does not have three components (delimited by a .)',
  'jwt signature is required',
  'invalid signature',
  'jwt audience invalid',
  'jwt issuer invalid',
  'jwt id invalid',
  'jwt subject invalid',
]

const catchJwtError: ErrorRequestHandler = (e, _req, res, next) => {
  if (!(e.name === 'JsonWebTokenError')) return next(e)

  // @ts-ignore
  const { message: dangerousMsg, expiredAt: origExpiredAt, date: origDate } = e as VerifyErrors

  const safeMsg =
    whiteListMsgs.find(msg => dangerousMsg.startsWith(msg)) || 'invalid/expired token'
  const errors = Object.fromEntries(
    Object.entries({ expiredAt: origExpiredAt, date: origDate }).filter(
      ([, v]) => typeof v === 'number' || v instanceof Date
    )
  )

  throw restError({
    code: StatusCodes.UNAUTHORIZED,
    message: safeMsg,
    errors,
  })
}

export default catchJwtError
