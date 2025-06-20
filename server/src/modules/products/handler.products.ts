import { StatusCodes } from 'http-status-codes'
import { type Handler } from 'express'

import restError from '../../utils/RestError.js'
import requireInSchema from '../../middlewares/requireInSchema.js'
import requireAuthenticated from '../../middlewares/requireAuthenticated.js'
import {
  productCreationSchema,
  type ProductCreationSchemaType,
  productDeletionSchema,
  type ProductDeletionSchemaType,
  productGetSchema,
  type ProductGetSchemaType,
  productUpdatingSchema,
  type ProductUpdatingSchemaType,
} from './schemas.products.js'

const createProductHandler: Array<Handler> = [
  requireInSchema(productCreationSchema),
  requireAuthenticated,
  async function createProductHandler(req, res) {
    const user = req.ctx.user!
    const { body: payload } = req.ctx.inSchema! as ProductCreationSchemaType
    const { prisma } = req.ctx

    const product = await prisma.product.create({
      data: {
        title: payload.title,
        description: payload.description,
        price: payload.price,
        userId: user.id,
      },
    })

    return res.status(StatusCodes.CREATED).json(product)
  },
]

const deleteProductHandler: Array<Handler> = [
  requireInSchema(productDeletionSchema),
  requireAuthenticated,
  async function deleteProductHandler(req, res) {
    const user = req.ctx.user!
    const {
      params: { productId },
    } = req.ctx.inSchema! as ProductDeletionSchemaType
    const { prisma } = req.ctx

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        userId: true,
        title: true,
        description: true,
        price: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!product)
      throw restError({
        code: StatusCodes.NOT_FOUND,
        message: 'Product not found',
      })

    if (product.userId !== user.id)
      throw restError({
        code: StatusCodes.FORBIDDEN,
        message: "You don't have access on this resource",
      })

    await prisma.product.delete({
      where: { id: productId },
      select: {},
    })

    return res.status(StatusCodes.OK).json(product)
  },
]

const updateProductHandler: Handler[] = [
  requireInSchema(productUpdatingSchema),
  requireAuthenticated,
  async function updateDeleteHandler(req, res) {
    const {
      params: { productId },
      body: productPayload,
    } = req.ctx.inSchema! as ProductUpdatingSchemaType

    const user = req.ctx.user!
    const { prisma } = req.ctx

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    })

    if (!product)
      throw restError({
        code: StatusCodes.NOT_FOUND,
        message: 'Product Not Found',
      })

    if (product.userId !== user.id)
      throw restError({
        code: StatusCodes.FORBIDDEN,
        message: "You Don't have access to this product",
      })

    return res.status(StatusCodes.OK).json(
      await prisma.product.update({
        where: { id: productId },
        data: { ...productPayload },
      })
    )
  },
]

const getAllProducts: Array<Handler> = [
  async function getAllProducts(req, res) {
    const { prisma } = req.ctx

    const products = await prisma.product.findMany()
    return res.status(StatusCodes.OK).json(products)
  },
]

const getProduct: Array<Handler> = [
  requireInSchema(productGetSchema),
  async function getProduct(req, res) {
    const {
      params: { productId },
    } = req.ctx.inSchema! as ProductGetSchemaType
    const { prisma } = req.ctx

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    if (!product) throw restError({ code: StatusCodes.NOT_FOUND, message: 'Product not exists' })

    return res.status(StatusCodes.OK).json(product)
  },
]
export {
  createProductHandler,
  deleteProductHandler,
  updateProductHandler,
  getAllProducts,
  getProduct,
}
