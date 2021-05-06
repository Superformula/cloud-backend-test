import { Context } from '../graphql/types/context';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';

export const handleErrorsPlugin: ApolloServerPlugin<Context> = {
	requestDidStart: () => {
		return {
			didEncounterErrors: (ctx) => {
				console.error(ctx.errors);
			},
		};
	},
};
