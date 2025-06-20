import express from 'express'

import {
  createUserHandler,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './users.handlers.js'

const userRouter = express.Router()

userRouter.get('/', getAllUsers)
userRouter.post('/', createUserHandler)
userRouter.get('/:userId', getUser)
userRouter.put('/:userId', updateUser)
userRouter.delete('/:userId', deleteUser)

export default userRouter
