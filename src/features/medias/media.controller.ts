import { Request, Response } from 'express'
import { IStorageProvider } from '@/providers/interfaces/storage.interface'
import { MediaService } from './media.service'
import { i18n } from '@/loaders/i18n'

export class MediaController {
  private mediaService: MediaService

  constructor(private s3Provider: IStorageProvider) {
    this.mediaService = new MediaService(this.s3Provider)
  }

  async get(req: Request, res: Response) {
    try {
      const media = await this.mediaService.get(req.params.key)
      media.pipe(res)
    } catch (e) {
      if (e.code === 'NotFound') {
        res
          .status(404)
          .send(i18n.__('errors.not_found', i18n.__('labels.media')))
      } else {
        res.status(500).send(i18n.__('errors.internal_server_error'))
      }
    }
  }
}
