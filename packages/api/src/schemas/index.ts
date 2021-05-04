import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import location from './location';
import user from './user';

export const resolvers = mergeResolvers([
  location.resolver,
  user.resolver,
]);

export const typeDefs = mergeTypeDefs([
  location.typeDefs,
  user.typeDefs,
]);
