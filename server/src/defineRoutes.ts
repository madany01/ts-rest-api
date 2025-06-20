import { type Express } from 'express'
import express from 'express'

import userRouter from './modules/users/users.router.js'
import tokensRouter from './modules/tokens/tokens.router.js'
import productsRouter from './modules/products/router.products.js'
import catchZodError from './middlewares/catchZodError.js'
import catchRestError from './middlewares/catchRestError.js'
import catchPrismaError from './middlewares/catchPrismaError.js'
import throw404ErrorMiddleware from './middlewares/throw404ErrorMiddleware.js'
import catchGlobalError from './middlewares/catchGlobalError.js'
import catchJwtError from './middlewares/catchJwtError.js'

const r = express.Router()
r.post('/', (req, res) => {
  res.json({ a: 'temp in defineRoutes' })
})

function defineRoutes(app: Express) {
  app.get('/api/heartbeat', (_, res) => res.sendStatus(200))

  app.use('/api/users', userRouter)
  app.use('/api/tokens', tokensRouter)
  app.use('/api/products', productsRouter)
  app.use('/', r)
  app.use(throw404ErrorMiddleware)

  app.use(catchZodError)
  app.use(catchJwtError)
  app.use(catchPrismaError)
  app.use(catchRestError)

  app.use(catchGlobalError)
}

export default defineRoutes
