import { faker } from '@faker-js/faker'
import { BusinessError } from './business-error'

describe('BusinessError', () => {
  test('Should set bussiness errors attributes with correct values', async () => {
    const message = faker.random.words()
    const error = new BusinessError(message, 400)
    expect(error.isOperational).toBe(true)
    expect(error.message).toBe(message)
    expect(error.status).toBe('failed')
    expect(error.statusCode).toBe(400)
  })

  test('Should set bussiness errors attributes with correct values on 500', async () => {
    const message = faker.random.words()
    const error = new BusinessError(message, 500)
    expect(error.isOperational).toBe(false)
    expect(error.message).toBe(message)
    expect(error.status).toBe('error')
    expect(error.statusCode).toBe(500)
  })
})
