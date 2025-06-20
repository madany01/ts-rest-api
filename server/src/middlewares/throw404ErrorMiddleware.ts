import { type Handler } from 'express'

import restError from '../utils/RestError.js'

const throw404ErrorMiddleware: Handler = (_req, _res, _next) => {
  throw restError({
    code: 404,
    message: 'Resource not found',
  })
}

export default throw404ErrorMiddleware
