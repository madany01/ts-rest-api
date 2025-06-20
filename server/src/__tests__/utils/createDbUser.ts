import prisma from '../../prisma/index.js'
import createFakeUserData from './createFakeUserData.js'
import passwords from '../../utils/passwords.js'

const createDbUser = async (data = createFakeUserData()) => {
  return {
    password: data.password,
    user: await prisma.user.create({
      data: { ...data, password: await passwords.hash(data.password) },
    }),
  }
}

export default createDbUser
