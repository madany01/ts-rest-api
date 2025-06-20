import type { ConfType } from './ConfType.js'

const _devConf: ConfType = {
  nodeEnv: 'dev',
  serverPort: 3000,

  db: {
    url: process.env.DATABASE_URL!,
  },
  passwordSaltRounds: 10,
  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY!,
    privateKey: process.env.JWT_PRIVATE_KEY!,
    refreshTokenTtlSecs: 7 * 24 * 60 * 60, // 7 days
    accessTokenTtlSecs: 1 * 24 * 60 * 60, // 1 day
    // TODO
  },
}
export default _devConf
