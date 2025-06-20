import {
  type StatusCodes,
  type ReasonPhrases,
  getStatusCode,
  getReasonPhrase,
} from 'http-status-codes'

class RestError extends Error {
  name = 'RestError'
}

const restErrorProtoSym = Symbol('RestError')

type RestErrorParams = {
  code: StatusCodes | ReasonPhrases
  message?: string
  [k: string | number]: unknown
}
type RestBaseType = {
  HttpStatusCode: StatusCodes
  HttpReasonPhrase: ReasonPhrases
  [restErrorProtoSym]: RestError
}

type RestErrorType<T extends RestErrorParams> = RestBaseType &
  (T['message'] extends string ? { message: string } : void) &
  Omit<T, 'code' | 'message'>

function restError<T extends RestErrorParams>({ code, message, ...other }: T) {
  code = typeof code === 'number' ? code : getStatusCode(code)

  const payload: RestErrorType<T> = {
    HttpStatusCode: code,
    HttpReasonPhrase: getReasonPhrase(code) as ReasonPhrases,
    [restErrorProtoSym]: new RestError(),
    ...(message !== undefined ? { message } : {}),
    ...other,
  } as any

  Object.defineProperty(payload, restErrorProtoSym, { enumerable: false })
  Object.setPrototypeOf(payload, payload[restErrorProtoSym])

  return payload
}

export default restError
export { RestError }
export type { RestErrorType, RestBaseType }
