import { z } from 'zod'

import strValidator from '../../libs/strValidator.js'

const BaseProductParamsSchema = z.object({
  productId: z.coerce.number().finite(),
})
const BaseProductBodySchema = z
  .object({
    title: z
      .string()
      .trim()
      .transform(str => strValidator.escape(str))
      .pipe(z.string().max(128)),
    description: z
      .string()
      .trim()
      .transform(str => strValidator.escape(str))
      .pipe(z.string().max(512)),
    price: z.number().finite().nonnegative(),
  })
  .strict()

const productCreationSchema = z.object({
  body: BaseProductBodySchema,
})

const productUpdatingSchema = z.object({
  params: BaseProductParamsSchema,
  body: BaseProductBodySchema,
})

const productDeletionSchema = z.object({
  params: BaseProductParamsSchema,
})

const productGetSchema = z.object({
  params: BaseProductParamsSchema,
  // TODO pick, page ..
})

type ProductCreationSchemaType = z.infer<typeof productCreationSchema>
type ProductUpdatingSchemaType = z.infer<typeof productUpdatingSchema>
type ProductDeletionSchemaType = z.infer<typeof productDeletionSchema>
type ProductGetSchemaType = z.infer<typeof productGetSchema>

export { productCreationSchema, productDeletionSchema, productUpdatingSchema, productGetSchema }
export type {
  ProductCreationSchemaType,
  ProductUpdatingSchemaType,
  ProductDeletionSchemaType,
  ProductGetSchemaType,
}
