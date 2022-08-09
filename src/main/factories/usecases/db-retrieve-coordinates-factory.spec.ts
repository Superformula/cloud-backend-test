import { DbRetrieveCoordinates } from '@data/usecases/db-retrieve-coordinates'
import { makeDbRetrieveCoordinates } from './db-retrieve-coordinates-factory'

describe('DbRetrieveCoordinatesFactory', () => {
  test('Should return DbRetrieveCoordinates instance', async () => {
    const sut = makeDbRetrieveCoordinates()
    expect(sut).toBeInstanceOf(DbRetrieveCoordinates)
  })
})
