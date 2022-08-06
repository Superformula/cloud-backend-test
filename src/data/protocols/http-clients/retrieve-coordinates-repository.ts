import { Coordinate } from '@domain/models'

export interface RetrieveCoordinatesRepository {
  retrieveCoordinates: (address: string) => Promise<RetrieveCoordinatesRepository.Result>
}

export namespace RetrieveCoordinatesRepository {
  export type Result = Coordinate
}
