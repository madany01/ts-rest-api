import restError from './RestError.js'

type RestErrorParams = Parameters<typeof restError>[0]

const throw404IfNullish = <T>(val: T, restErrorParams?: Partial<RestErrorParams> | string) => {
  if (val != null) return val

  const additionalParams = typeof restErrorParams === 'string' ? null : restErrorParams
  const message =
    typeof restErrorParams === 'string' ? `${restErrorParams} not found` : 'resource not found'

  throw restError({
    code: 404,
    message,
    ...additionalParams,
  })
}

export default throw404IfNullish
