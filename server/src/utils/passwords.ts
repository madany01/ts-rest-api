import bcrypt from 'bcryptjs'

import conf from '../conf/index.js'

const hash = async (password: string) => {
  return bcrypt.hash(password, conf.passwordSaltRounds)
}

const compare = async (plain: string, hashed: string) => {
  return bcrypt.compare(plain, hashed)
}

const passwords = {
  hash,
  compare,
}

export default passwords
