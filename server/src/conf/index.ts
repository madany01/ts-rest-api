import path from 'path'

import dotenv from 'dotenv'

import { type ConfType } from './ConfType.js'

type NodeEnvType = 'dev' | 'test' | 'production'
function getNodeEnv(): NodeEnvType {
  const env = process.env.NODE_ENV
  if (env === undefined) return 'dev'

  if (['dev', 'test', 'production'].includes(env)) return env as any

  return 'dev'
}

const nodeEnv = getNodeEnv()
process.env.NODE_ENV = nodeEnv

dotenv.config({
  path: path.resolve(process.cwd(), nodeEnv === 'dev' ? '.env' : `.env.${nodeEnv}`),
})
// TODO ${production}
const { default: conf }: { default: ConfType } = await import(`./_${nodeEnv}Conf.ts`)

export default conf
