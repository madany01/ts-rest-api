import express from 'express'

import {
  createAccessToken,
  createTokensPair,
  deleteAllRefreshTokens,
  deleteRefreshToken,
  getRefreshTokens,
} from './tokens.handlers.js'

const tokensRouter = express.Router()

tokensRouter.post('/', createTokensPair)
tokensRouter.post('/access', createAccessToken)
tokensRouter.get('/refresh', getRefreshTokens)
tokensRouter.delete('/refresh', deleteAllRefreshTokens)
tokensRouter.delete('/refresh/:tokenId', deleteRefreshToken)

export default tokensRouter
