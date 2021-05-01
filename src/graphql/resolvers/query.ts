import moment from 'moment';
import { QueryResolvers } from '../types/schema-types';

export const Query: QueryResolvers = {
	user: async () => {
		return {
			createdAt: moment().toISOString(),
			updatedAt: moment().toISOString(),
			dob: moment().toISOString(),
			address: 'test location',
			name: 'Test user',
			id: '123456',
		};
	},
};
