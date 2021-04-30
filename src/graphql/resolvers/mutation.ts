import moment from 'moment';
import { MutationResolvers } from '../types';

export const Mutation: MutationResolvers = {
	createUser: async () => {
		return {
			createdAt: moment().toISOString(),
			location: 'test location',
			name: 'Test user',
		};
	},
};
