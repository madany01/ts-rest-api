import express from 'express'

import 'express-async-errors'

import defineRoutes from './defineRoutes.js'
import prisma from './prisma/index.js'

const app = express()

app.use((req, res, next) => {
  req.ctx = {
    prisma,
  }
  return next()
})

app.use(express.json())

defineRoutes(app)

export default app
