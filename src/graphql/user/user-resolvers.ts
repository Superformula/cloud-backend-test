export default {
	Query: {
		user: async (_parent: any, args: any, context: any): Promise<any> => {
			return context.dataSources.userRepo.getItem(args.id);
		},
	},
	Mutation: {
		createUser: async (_parent: any, _args: any, _context: any): Promise<any> => ({}),
		updateUser: async (_parent: any, _args: any, _context: any): Promise<any> => ({}),
		deleteUser: async (_parent: any, _args: any, _context: any): Promise<any> => ({}),
	},
};
