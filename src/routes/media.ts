import { Router } from 'express'
import { router as mediaRoute } from '@/features/medias/media.route'

// Define router..
const router = Router()

// controllers
router.use('/', mediaRoute)

export { router }
