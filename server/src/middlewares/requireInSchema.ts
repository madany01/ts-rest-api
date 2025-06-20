import { type Schema } from 'zod'

import type { Handler } from 'express'

const requireInSchema: (inSchema: Schema) => Handler = schema => {
  return async function validateInSchema(req, res, next) {
    const { params, query, body } = req
    req.ctx.inSchema = schema.parse({ params, query, body })
    return next()
  }
}

export default requireInSchema
