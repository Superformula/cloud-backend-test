import { Router } from 'express'
import { S3Provider } from '@/providers/s3.provider'
import { MediaController } from './media.controller'

const router = Router()

const s3Provider = new S3Provider()
const mediaController = new MediaController(s3Provider)

router.get('/:key', async (request, response) => {
  return await mediaController.get(request, response)
})

export { router }
