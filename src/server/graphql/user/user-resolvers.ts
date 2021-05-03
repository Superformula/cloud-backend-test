import { Context } from '../../types/context';
import { Resolvers } from '../types';

export const userResolvers: Resolvers<Context> = {
	Query: {
		user: async (_parent, args, context) => {
			const userModel = await context.dataSources.userDataSource.getItem(args.id);
			return context.userModelConverter.fromDbModelToGqlModel(userModel);
		},
		listUsers: async (_parent, args, context) => {
			const pagOutput = await context.dataSources.userDataSource.listItems(args.paginationParams, args.nameFilter);
			return context.userModelConverter.fromPaginationOutputModelToUserPaginationResult(pagOutput);
		},
	},
	Mutation: {
		createUser: async (_, args, context) => {
			const userModel = await context.dataSources.userDataSource.putItem(args.input);
			return context.userModelConverter.fromDbModelToGqlModel(userModel);
		},
		updateUser: async (_, args, context) => {
			const userModel = await context.dataSources.userDataSource.updateItem(args.id, args.input);
			return context.userModelConverter.fromDbModelToGqlModel(userModel);
		},
		deleteUser: async (_, args, context) => {
			const userModel = await context.dataSources.userDataSource.deleteItem(args.id);
			return context.userModelConverter.fromDbModelToGqlModel(userModel);
		},
	},
};

export default userResolvers;
