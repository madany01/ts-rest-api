import { z } from 'zod'
import { StatusCodes } from 'http-status-codes'
import { type ErrorRequestHandler } from 'express'

import restError from '../utils/RestError.js'

const catchZodError: ErrorRequestHandler = (e, _req, res, next) => {
  if (!(e instanceof z.ZodError)) return next(e)

  throw restError({
    code: StatusCodes.BAD_REQUEST,
    message: 'validation error',
    errors: e.errors,
  })
}

export default catchZodError

/*
  {
    "code": "too_small",
    "minimum": 2,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "String must contain at least 2 character(s)",
    "path": [
      "body",
      "pass"
    ]
  }
*/
