import { z } from 'zod'

import { schemas } from '../../utils/schemas.js'

const tokenCreationSchema = z.object({
  body: z
    .object({
      email: schemas.email,
      password: schemas.password('Bad password'),
    })
    .strict(),
})

const tokenDeletionSchema = z.object({
  params: z.object({
    tokenId: z.string().uuid(),
  }),
})

type TokenCreationSchemaType = z.infer<typeof tokenCreationSchema>
type TokenDeletionSchemaType = z.infer<typeof tokenDeletionSchema>

export { tokenCreationSchema, tokenDeletionSchema }
export type { TokenCreationSchemaType, TokenDeletionSchemaType }
