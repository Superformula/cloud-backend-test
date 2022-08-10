import { adaptResolver } from '@main/adapters'
import { makeRetrieveCoordinatesController } from '@main/factories/controllers'
import { Arg, Query, Resolver } from 'type-graphql'
import { Coordinate } from '../entities'

@Resolver()
export class CoordinateResolver {
  @Query(() => Coordinate, { nullable: true })
  async coordinate (@Arg('address', type => String) address: string): Promise<Coordinate> {
    return await adaptResolver(makeRetrieveCoordinatesController(), { address })
  }
}
