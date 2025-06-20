import type { ConfType } from './ConfType.js'

const _testConf: ConfType = {
  nodeEnv: 'test',

  serverPort: 3000,

  db: {
    url: process.env.DATABASE_URL!,
  },
  passwordSaltRounds: 2,
  jwt: {
    publicKey: process.env.JWT_PUBLIC_KEY!,
    privateKey: process.env.JWT_PRIVATE_KEY!,
    refreshTokenTtlSecs: 7 * 24 * 60 * 60, // 1 days
    accessTokenTtlSecs: 1 * 60 * 60, // 1 hour
  },
}

export default _testConf
