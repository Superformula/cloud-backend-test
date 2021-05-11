import { i18n } from '@/loaders/i18n'
import { BaseError, MediaNotSupportedError, NotFoundError, ValidationError } from '@/common/error'
import { BaseService } from '@/common/base.service'
import { User } from '@/models/user.model'
import winston from 'winston'
import {
  IStorageProvider
} from '@/providers/interfaces/storage.interface'
import { UserSearch } from './user.search'

export class UserService extends BaseService {
  constructor(private storageProvider: IStorageProvider) {
    super()
  }

  async findAll(
    searchCriteria?: any
  ): Promise<User[]> {
    try {
      const modelSearch = new UserSearch(searchCriteria)
      const query = modelSearch.query()

      return await User.findAll({
        ...query
      })
    } catch (e) {
      const errorMessage = i18n.__('errors.find_all', i18n.__('labels.user.one'))
      winston.error(errorMessage, e)
      throw new BaseError(
        errorMessage,
        this.getErrors(e)
      )
    }
  }

  async find(id: string): Promise<User | null> {
    try {
      return await User.findByPk(id)
    } catch (e) {
      const errorMessage = i18n.__('errors.find_one', i18n.__('labels.user.one'))
      winston.error(errorMessage, e, {
        id
      })
      throw new BaseError(
        errorMessage,
        this.getErrors(e)
      )
    }
  }

  async create(
    user: User
  ): Promise<User> {
    let imageUrl

    try {
      imageUrl = await this.uploadFile(user)

      await User.build(user).validate()
      return await User.create(user)
    } catch (e) {
      if (imageUrl) {
        await this.storageProvider.delete(imageUrl)
      }

      if (e instanceof MediaNotSupportedError) {
        throw e
      }

      const errorMessage = i18n.__('errors.create', i18n.__('labels.user.one'))
      winston.error(errorMessage, e, {
        user: JSON.stringify(user)
      })
      throw new ValidationError(
        errorMessage,
        this.getErrors(e)
      )
    }
  }

  async update(
    user: User
  ): Promise<User> {
    
    const userDb = await User.findByPk(user.id)
    if (!userDb) {
      const notFoundMessage = i18n.__(
        'errors.not_found',
        i18n.__('labels.user.one')
      )
      winston.error(notFoundMessage, { id: user.id })
      throw new NotFoundError(notFoundMessage, {
        id: user.id
      })
    }

    let imageUrl
    try {
      imageUrl = await this.uploadFile(user, userDb)

      const updated = await userDb.update(user)

      return updated
    } catch (e) {
      if (imageUrl) {
        await this.storageProvider.delete(imageUrl)
      }

      if (e instanceof NotFoundError || e instanceof MediaNotSupportedError) {
        throw e
      }
      
      const errorMessage = i18n.__('errors.update', i18n.__('labels.user.one'))
      winston.error(errorMessage, e, {
        user: JSON.stringify(user)
      })
      throw new ValidationError(
        errorMessage,
        this.getErrors(e)
      )
    }
  }

  async delete(
    id: string
  ): Promise<void> {
    try {
      const userDb = await User.findByPk(id)
      if (!userDb) {
        const notFoundMessage = i18n.__(
          'errors.not_found',
          i18n.__('labels.user.one')
        )
        winston.error(notFoundMessage, { id })
        throw new NotFoundError(notFoundMessage, {
          id
        })
      }

      if (userDb.imageUrl) {
        await this.storageProvider.delete(userDb.imageUrl)
      }

      await User.destroy({
        where: {
          id
        },
        individualHooks: true
      })

      return Promise.resolve()
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e
      }

      const errorMessage = i18n.__('errors.delete', i18n.__('labels.user.one'))
      winston.error(errorMessage, e, { id })
      throw new BaseError(
        errorMessage,
        this.getErrors(e)
      )
    }
  }

  async uploadFile(user, userDb?) {
    if (user.image) {
      const { createReadStream, mimetype, filename } = await user.image

      if (mimetype.indexOf('image/') < 0) {
        throw new MediaNotSupportedError(i18n.__('errors.media_not_supported', mimetype))
      }

      let stream = createReadStream()

      const uploaded = await this.storageProvider.upload({
        stream,
        filename,
        mimetype
      })

      const imageUrl = uploaded.uri

      if (userDb && userDb.imageUrl) {
        await this.storageProvider.delete(userDb.imageUrl)
      }

      user.imageUrl = imageUrl

      return imageUrl
    }

    return null
  }
}
