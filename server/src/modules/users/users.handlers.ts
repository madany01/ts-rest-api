import { StatusCodes } from 'http-status-codes'

import {
  type UserCreationSchemaType,
  userCreationSchema,
  userSelectionSchema,
  type UserSelectionSchemaType,
  type UserDeletionSchemaType,
  userDeletionSchema,
  userUpdatingSchema,
  type UserUpdatingSchemaType,
} from './users.schemas.js'
import requireInSchema from '../../middlewares/requireInSchema.js'
import requireAuthenticated from '../../middlewares/requireAuthenticated.js'
import restError from '../../utils/RestError.js'
import throw404IfNullish from '../../utils/throw404IfNullish.js'
import passwords from '../../utils/passwords.js'

import type { Handler } from 'express'

const createUserHandler: Handler[] = [
  requireInSchema(userCreationSchema),
  async function createUserHandler(req, res) {
    const { body } = req.ctx.inSchema as UserCreationSchemaType
    const { prisma } = req.ctx

    const { passwordConfirmation, ...data } = body

    const user = await prisma.user.create({
      data: { ...data, password: await passwords.hash(data.password) },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    })
    return res.status(StatusCodes.CREATED).json(user)
  },
]

const updateUser: Handler[] = [
  requireInSchema(userUpdatingSchema),
  requireAuthenticated,
  async (req, res) => {
    const {
      params: { userId },
      body: { passwordConfirmation: _, ...body },
    } = req.ctx.inSchema! as UserUpdatingSchemaType

    const requester = req.ctx.user!

    if (requester.id !== userId) throw restError({ code: 403 })

    const { prisma } = req.ctx

    if (body.password != null) body.password = await passwords.hash(body.password)

    const user = await prisma.user.update({
      where: { id: userId },
      data: body,
    })

    req.ctx.user = user

    const { password, ...userWithoutPass } = user

    return res.json(userWithoutPass)
  },
]

const getAllUsers: Handler[] = [
  async (req, res) => {
    const { prisma } = req.ctx

    const users = await prisma.user.findMany()

    const usersWithoutPassEmail = users.map(({ password, email, ...u }) => u)

    return res.json(usersWithoutPassEmail)
  },
]

const getUser: Handler[] = [
  requireInSchema(userSelectionSchema),
  async (req, res) => {
    const {
      params: { userId },
    } = req.ctx.inSchema as UserSelectionSchemaType
    const { prisma } = req.ctx

    const { password, email, ...user } = throw404IfNullish(
      await prisma.user.findUnique({
        where: { id: userId },
      }),
      'user'
    )

    return res.json(user)
  },
]

const deleteUser: Handler[] = [
  requireInSchema(userDeletionSchema),
  requireAuthenticated,
  async (req, res) => {
    const {
      params: { userId },
    } = req.ctx.inSchema as UserDeletionSchemaType
    const requester = req.ctx.user!

    if (requester.id !== userId)
      throw restError({
        code: 403,
        message: "you don't have permission to delete the user",
      })

    const { prisma } = req.ctx
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) throw restError({ code: 404 })

    await prisma.$transaction([
      prisma.product.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    req.ctx.user = undefined

    const { password, ...userWithoutPass } = user

    return res.json(userWithoutPass)
  },
]

export { createUserHandler, getAllUsers, getUser, deleteUser, updateUser }
