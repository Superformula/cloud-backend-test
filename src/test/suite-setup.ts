import { sequelize } from '@/models'
import winston from 'winston'

beforeAll(() => {
  jest
    .spyOn(winston, 'error')
    .mockReturnValue(({} as unknown) as winston.Logger)

  jest.spyOn(winston, 'info').mockReturnValue(({} as unknown) as winston.Logger)
})

afterAll(async () => {
  await sequelize.close()
})
