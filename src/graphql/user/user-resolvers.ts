import { MutationResolvers, QueryResolvers } from '../../types/graphql';

export default {
	Query: {
		user: async (_parent, args, context) => await context.dataSources.userRepo.getItem(args.id),
	} as QueryResolvers,
	Mutation: {
		createUser: async (_, args, context) => await context.dataSources.userRepo.putItem(args.input),
		updateUser: async (_, args, context) => await context.dataSources.userRepo.updateItem(args.id, args.input),
		deleteUser: async (_, args, context) => await context.dataSources.userRepo.deleteItem(args.id),
	} as MutationResolvers,
};
