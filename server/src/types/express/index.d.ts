// @ts-ignore
import type RequestContext from '../RequestContext.js'

declare global {
  namespace Express {
    interface Request {
      ctx: RequestContext
    }
  }
}

export { type Request }
