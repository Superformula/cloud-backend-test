import { mapUser } from '../../mappers/user-mapper';
import { Context } from '../types/context';
import { QueryResolvers } from '../types/schema-types';

export const Query: QueryResolvers<Context> = {
	user: async (_parent, args, context) => {
		const user = await context.userRepository.getUser(args.id);
		return mapUser(user);
	},
	users: async (_parent, args, context) => {
		const users = await context.userRepository.listUsers(args.query, args.limit, args.cursor);
		return {
			items: users.items.map((u) => mapUser(u)),
			cursor: users.cursor,
		};
	},
	geolocation: async (_parent, args, context) => {
		return await context.geolocationRepository.getGeolocation(args.query);
	},
};
