import conf from './conf/index.js'
import logger from './libs/logger.js'
import app from './app.js'

app.listen(conf.serverPort, () => {
  logger.info(`🚀 Server listening on port ${conf.serverPort}`)
})
