/* eslint-disable consistent-return */
import z from 'zod'

import { schemas } from '../../utils/schemas.js'
import validator from '../../libs/strValidator.js'

const userIdSchema = z.string().uuid()
const passwordsSchema = z
  .object({
    password: schemas.password(),
    passwordConfirmation: z.string(),
  })
  .strict()
const nameSchema = z
  .string()
  .trim()
  .nonempty()
  .transform(v => validator.escape(v))
  .pipe(z.string().max(64))

const userCreationSchema = z.object({
  body: z
    .object({
      email: schemas.email,
      name: nameSchema,
    })
    .merge(passwordsSchema)
    .strict()
    .refine(obj => obj.password === obj.passwordConfirmation, {
      message: 'Passwords mismatch',
      path: ['passwordConfirmation'],
    }),
})

const userSelectionSchema = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
})

const userDeletionSchema = userSelectionSchema

const userUpdatingSchema = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
  body: z
    .object({
      email: schemas.email,
      name: nameSchema,
    })
    .partial()
    .merge(passwordsSchema.partial())
    .strict()
    .superRefine((obj, ctx) => {
      if (obj.password === obj.passwordConfirmation) return

      if (typeof obj.password === typeof obj.passwordConfirmation)
        return ctx.addIssue({
          code: 'custom',
          message: 'Passwords mismatch',
          path: ['passwordConfirmation'],
        })

      const missingField = obj.password === undefined ? 'password' : 'passwordConfirmation'

      return ctx.addIssue({
        code: 'invalid_type',
        expected: 'string',
        received: 'undefined',
        path: [missingField],
        message: 'Required',
      })
    }),
})

type UserCreationSchemaType = z.infer<typeof userCreationSchema>
type UserSelectionSchemaType = z.infer<typeof userSelectionSchema>
type UserDeletionSchemaType = z.infer<typeof userDeletionSchema>
type UserUpdatingSchemaType = z.infer<typeof userUpdatingSchema>

export { userCreationSchema, userSelectionSchema, userDeletionSchema, userUpdatingSchema }
export type {
  UserCreationSchemaType,
  UserSelectionSchemaType,
  UserDeletionSchemaType,
  UserUpdatingSchemaType,
}
