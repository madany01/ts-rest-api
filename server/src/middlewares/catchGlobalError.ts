import { type ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import conf from '../conf/index.js'
import logger from '../libs/logger.js'
import restError, { type RestBaseType } from '../utils/RestError.js'

const catchGlobalError: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err, 'catchGlobalError')

  if (conf.nodeEnv === 'production') {
    const resterr = restError({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    }) as any as RestBaseType

    return res.status(resterr.HttpStatusCode).json({ ...resterr })
  }

  return next(err)
}

export default catchGlobalError
