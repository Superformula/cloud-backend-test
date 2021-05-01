import Context from '../../misc/context-type';
import { Resolvers } from '../types';

export const userResolvers: Resolvers<Context> = {
	Query: {
		user: async (_parent, args, context) => {
			const userModel = await context.dataSources.userRepo.getItem(args.id);
			return context.userModelConverter.fromDbModelToGraphQLModel(userModel);
		},
	},
	Mutation: {
		createUser: async (_, args, context) => {
			const userModel = await context.dataSources.userRepo.putItem(args.input);
			return context.userModelConverter.fromDbModelToGraphQLModel(userModel);
		},
		updateUser: async (_, args, context) => {
			const userModel = await context.dataSources.userRepo.updateItem(args.id, args.input);
			return context.userModelConverter.fromDbModelToGraphQLModel(userModel);
		},
		deleteUser: async (_, args, context) => {
			const userModel = await context.dataSources.userRepo.deleteItem(args.id);
			return context.userModelConverter.fromDbModelToGraphQLModel(userModel);
		},
	},
};

export default userResolvers;
