// import crypto from 'crypto'
// import fs from 'fs/promises'
// import path from 'path'
// import { promisify } from 'util'
// import { fileURLToPath } from 'url'

// const keys = await promisify(crypto.generateKeyPair)('ec', {
//   // namedCurve: 'P-256',
//   namedCurve: 'P-192',
//   privateKeyEncoding: {
//     type: 'pkcs8',
//     format: 'pem',
//   },
//   publicKeyEncoding: {
//     type: 'spki',
//     format: 'pem',
//   },
// })

// // const __dirname = path.dirname(fileURLToPath(import.meta.url))
// // await fs.mkdir(path.join(__dirname, '../secrets'), { recursive: true })
// // await fs.writeFile(path.join(__dirname, '../secrets/private.pem'), keys.privateKey)
// // await fs.writeFile(path.join(__dirname, '../secrets/public.pem'), keys.publicKey)

// console.log(keys)
