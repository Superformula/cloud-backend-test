import { BusinessError } from '@domain/errors/business-error'
import { HttpResponse } from '@presentation/protocols'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const catchError = (error: Partial<BusinessError>): HttpResponse => ({
  statusCode: error?.statusCode || 500,
  body: error
})
