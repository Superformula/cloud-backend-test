import { BaseService } from '@/common/base.service'
import { IStorageProvider } from '@/providers/interfaces/storage.interface'
import winston from 'winston'

export class MediaService extends BaseService {
  constructor(private storageProvider: IStorageProvider) {
    super()
  }

  async get(key) {
    try {
      return await this.storageProvider.get(key)
    } catch (e) {
      winston.error('Error getting media', e, {
        key
      })
      throw e
    }
  }
}
