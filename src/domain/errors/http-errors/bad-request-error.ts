import { BusinessError } from '../business-error'

export class BadRequestError extends BusinessError {
  constructor (message: string) {
    super(message, 400)
    this.name = 'BadRequestError'
  }
}
