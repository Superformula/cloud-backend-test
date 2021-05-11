import bodyParser from 'body-parser'
import cors from './cors'
import logger from 'morgan'
import compression from 'compression'
import { router } from '@/routes'
import rateLimit from 'express-rate-limit'

export default ({ app }) => {
  if (process.env.NODE_ENV === 'production') {
    app.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      })
    )
  }

  app.use(compression())
  app.use(logger('dev'))
  app.use(bodyParser.json({ limit: '5mb' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }))
  app.use(cors())
  app.use('/', router)
}
