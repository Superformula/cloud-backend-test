import express from 'express'
import { config } from 'dotenv'

const app = express()

// load environment variables
config()

const port = process.env.PORT ?? '3000'
app.set('port', port)

import loaders from '@/loaders'
loaders({ app })

export { app, port }
