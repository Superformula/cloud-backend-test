import { Context } from '../types/context';
import { MutationResolvers } from '../types/schema-types';

export const Mutation: MutationResolvers<Context> = {
	createUser: async (_parent, args, context) => {
		return await context.userRepository.createUser(args.data);
	},
};
