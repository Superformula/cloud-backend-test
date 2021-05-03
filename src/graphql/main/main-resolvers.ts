import { Context } from '../../types/context';
import { Resolvers } from '../types';

// Resolvers for common fields and types declared in Query and Mutation
export const mainResolvers: Resolvers<Context> = {
	Query: {
		hello: (): string => 'Hello world!', // dummy
	},
	Mutation: {
		ping: (): string => 'Pong', // dummy
	},
};

export default mainResolvers;
