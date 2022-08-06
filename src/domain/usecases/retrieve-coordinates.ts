import { Coordinate } from '../models'

export interface RetrieveCoordinates {
  retrieveCoordinates: (address: string) => Promise<RetrieveCoordinates.Result>
}

export namespace RetrieveCoordinates {
  export type Result = Coordinate
}
