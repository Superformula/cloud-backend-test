import { Coordinate } from '../models'

export interface RetrieveCoordinates {
  retrieveCoordinates: (address: string) => Promise<Coordinate>
}
