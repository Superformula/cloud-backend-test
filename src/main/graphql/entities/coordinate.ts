import { Coordinate } from '@domain/models'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CoordinateType implements Coordinate {
  @Field(() => Number, { nullable: false })
    latitude: number

  @Field(() => Number, { nullable: false })
    longitude: number
}
