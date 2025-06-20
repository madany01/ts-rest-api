type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
}

type ConfType = DeepReadonly<{
  nodeEnv: 'dev' | 'test' | 'production'

  serverPort: number

  db: {
    url: string
  }

  passwordSaltRounds: number

  jwt: {
    publicKey: string
    privateKey: string
    refreshTokenTtlSecs: number
    accessTokenTtlSecs: number
  }
}>

export type { ConfType }
