import { Coordinate as CoordinateModel } from '@domain/models'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class Coordinate implements CoordinateModel {
  @Field(() => Number, { nullable: false })
    latitude: number

  @Field(() => Number, { nullable: false })
    longitude: number
}
