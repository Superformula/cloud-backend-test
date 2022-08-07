import 'dotenv/config'
import { env } from './config/env'

const app = require('./config/app').default
app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`))
