import moment from 'moment';
import { QueryResolvers } from '../types';

export const Query: QueryResolvers = {
	user: async () => {
		return {
			createdAt: moment().toISOString(),
			location: 'test location',
			name: 'Test user',
		};
	},
};
