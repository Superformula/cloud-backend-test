import { Resolvers } from '../../types/graphql';

export const userResolvers: Resolvers = {
	Query: {
		user: async (_parent, args, context) => await context.dataSources.userRepo.getItem(args.id),
	},
	Mutation: {
		createUser: async (_, args, context) => await context.dataSources.userRepo.putItem(args.input),
		updateUser: async (_, args, context) => await context.dataSources.userRepo.updateItem(args.id, args.input),
		deleteUser: async (_, args, context) => await context.dataSources.userRepo.deleteItem(args.id),
	},
};

export default userResolvers;
