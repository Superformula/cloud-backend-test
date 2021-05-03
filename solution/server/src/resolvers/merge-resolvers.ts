import { mergeResolvers } from '@graphql-tools/merge'
import { UserResolver } from './user-resolvers'
import { AddressResolver } from './address-resolvers'

const resolvers = [UserResolver, AddressResolver]

export default mergeResolvers(resolvers)
