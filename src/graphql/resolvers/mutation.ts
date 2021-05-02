import { Context } from '../types/context';
import { MutationResolvers } from '../types/schema-types';

export const Mutation: MutationResolvers<Context> = {
	//TODO: Map UserModel (databse user type) to User (resolver return type)
	createUser: async (_parent, args, context) => {
		return await context.userRepository.createUser(args.data);
	},
	updateUser: async (_parent, args, context) => {
		return await context.userRepository.updateUser(args.id, args.data);
	},
	deleteUser: async (_parent, args, context) => {
		return await context.userRepository.deleteUser(args.id);
	},
};
