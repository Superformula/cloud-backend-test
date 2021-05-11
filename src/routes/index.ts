import { Router } from 'express'
import { router as mediaRoute } from './media'

const router = Router()

router.use('/media', mediaRoute)

export { router }
