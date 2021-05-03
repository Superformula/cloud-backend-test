import { Context } from '../types/context';
import { QueryResolvers } from '../types/schema-types';

export const Query: QueryResolvers<Context> = {
	user: async (_parent, args, context) => {
		//TODO: Map UserModel (databse user type) to User (resolver return type)
		return await context.userRepository.getUser(args.id);
	},
	users: async (_parent, args, context) => {
		//TODO: Map UserModel (databse user type) to User (resolver return type)
		return await context.userRepository.listUsers(args.query, args.limit, args.cursor);
	},
	geolocation: async (_parent, args, context) => {
		return await context.geolocationRepository.getGeolocation(args.query);
	},
};