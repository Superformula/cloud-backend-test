import { adaptResolver } from '@main/adapters'
import { makeRetrieveCoordinatesController } from '@main/factories/controllers'
import { Arg, Ctx, Query, Resolver } from 'type-graphql'
import { CoordinateType } from '../entities/coordinate'
import { MyContext } from '../my-context'

@Resolver()
export class CoordinateResolver {
  @Query(() => CoordinateType, { nullable: true })
  async coordinate (@Arg('address') address: string, @Ctx() context: MyContext): Promise<CoordinateType> {
    return await adaptResolver(makeRetrieveCoordinatesController(), context, { address })
  }
}
