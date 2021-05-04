import { mapUser } from '../../mappers/user-mapper';
import { Context } from '../types/context';
import { MutationResolvers } from '../types/schema-types';

export const Mutation: MutationResolvers<Context> = {
	createUser: async (_parent, args, context) => {
		const user = await context.userRepository.createUser(args.data);
		return mapUser(user);
	},
	updateUser: async (_parent, args, context) => {
		const user = await context.userRepository.updateUser(args.id, args.data);
		return mapUser(user);
	},
	deleteUser: async (_parent, args, context) => {
		const user = await context.userRepository.deleteUser(args.id);
		return mapUser(user);
	},
};
