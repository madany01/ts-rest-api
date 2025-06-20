import express from 'express'

import {
  createProductHandler,
  deleteProductHandler,
  getAllProducts,
  getProduct,
  updateProductHandler,
} from './handler.products.js'

const productsRouter = express.Router()

productsRouter.post('/', createProductHandler)
productsRouter.delete('/:productId', deleteProductHandler)
productsRouter.put('/:productId', updateProductHandler)
productsRouter.get('/:productId', getProduct)
productsRouter.get('/', getAllProducts)

export default productsRouter
