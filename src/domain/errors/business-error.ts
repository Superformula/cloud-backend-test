export class BusinessError extends Error {
  isOperational: boolean
  statusCode: number
  status: string

  constructor (message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error'
    this.isOperational = statusCode !== 500
  }
}
