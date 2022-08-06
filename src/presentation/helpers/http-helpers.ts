import { HttpResponse } from '@presentation/protocols'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
