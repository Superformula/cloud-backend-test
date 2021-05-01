import { Resolvers } from '../../types/graphql';

// Resolvers for common fields and types declared in Query and Mutation
export const mainResolvers: Resolvers = {
	Query: {
		hello: (): string => 'Hello world!', // dummy
	},
	Mutation: {
		ping: (): string => 'Pong', // dummy
	},
};

export default mainResolvers;
