import { Coordinate } from '@domain/models'

export interface RetrieveCoordinatesHttpClient {
  retrieveCoordinates: (address: string) => Promise<RetrieveCoordinatesHttpClient.Result>
}

export namespace RetrieveCoordinatesHttpClient {
  export type Result = Coordinate
}
