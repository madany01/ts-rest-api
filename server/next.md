# Todos & Mind Interruptions

* make postgres role specific for this db
* password max length <-> bcrypt
* zod error resp
* real email
* use @src/
* bad json @production
* decorators
* hash key len must be >= len of hash output (longer better)
  * sh256 => key >= 256
* on change password, revoke all sessions
* login throttling

## JWT
- lib should refuse jwt when alg not our server alg
- since monolithic, cookie with (httpOnly, sameSite) resilient to:
  - csrf: as sameSite wont send the cookie
  - xss:
    - as it's httpOnly
    - csp prevent js unless script from domain.com
  + __host secure

## CSP
- prevent js unless from domain.com
- only https
