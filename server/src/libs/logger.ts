import { pino } from 'pino'
import dayjs from 'dayjs'

const logger = pino({
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: {
    target: 'pino-pretty',
  },
  base: {
    pid: false,
  },
})

export default logger
