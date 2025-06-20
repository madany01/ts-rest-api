import { z } from 'zod'

import validator from '../libs/strValidator.js'

const passwordMsg =
  'Weak password, password must be at least 10 chars, including at least 1 small latin letter, 1 capital latin letter, 1 number and 1 symbol'

const email = z.string().trim().toLowerCase().email().max(64)
const password = (errorMsg: string = passwordMsg) =>
  z
    .string()
    .min(10)
    .max(64)
    .refine(password => validator.isStrongPassword(password), errorMsg)

export const schemas = { email, password }
