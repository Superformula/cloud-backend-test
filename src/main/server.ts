import 'dotenv/config'
import 'reflect-metadata'
import { env } from './config/env'

(async () => {
  const { setupApp } = await import('./config/app')
  const app = await setupApp()
  app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
})()
