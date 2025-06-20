import { type ErrorRequestHandler } from 'express'

import { type RestBaseType, RestError } from '../utils/RestError.js'

const catchRestError: ErrorRequestHandler = (err, req, res, next) => {
  if (!(err instanceof RestError)) return next(err)

  const resterr = err as any as RestBaseType

  return res.status(resterr.HttpStatusCode).json({ ...resterr })
}

export default catchRestError
