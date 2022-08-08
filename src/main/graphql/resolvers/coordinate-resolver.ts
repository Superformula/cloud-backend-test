import { adaptResolver } from '@main/adapters'
import { makeRetrieveCoordinatesController } from '@main/factories/controllers'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { Coordinate } from '../entities'
import { MyContext } from '../my-context'

@Resolver()
export class CoordinateResolver {
  @Query(() => Coordinate, { nullable: true })
  async coordinate (@Arg('address', type => String) address: string, @Ctx() { req }: MyContext): Promise<Coordinate> {
    return await adaptResolver(makeRetrieveCoordinatesController(), req, { address })
  }
}
