import {
  UserInputError,
  ApolloError
} from 'apollo-server-express'

export class BaseError extends Error {
  private data: any
  constructor(msg: string, data: any) {
    super(msg)
    this.data = data
  }
}

export class NotFoundError extends ApolloError {
  constructor(msg: string, props?: { [key: string]: any }) {
    super(msg, 'NOT_FOUND_ERROR', props)
  }
}

export class FileSizeError extends ApolloError {
  constructor(msg: string, props?: { [key: string]: any }) {
    super(msg, 'FILE_SIZE_ERROR', props)
  }
}

export class MediaNotSupportedError extends ApolloError {
  constructor(msg: string, props?: { [key: string]: any }) {
    super(msg, 'MEDIA_NOT_SUPPORTED', props)
  }
}

export class ValidationError extends UserInputError {
  constructor(msg: string, error: any) {
    super(msg)

    this.state = error.errors.reduce((result, err) => {
      if (Object.prototype.hasOwnProperty.call(result, err.field)) {
        result[err.field].push(err.message)
      } else {
        result[err.field] = [err.message]
      }
      return result
    }, {})

    this.code = error.status
  }
}
