export default {
	// Resolvers for common fields and types declared in Query and Mutation
	Query: {
		hello: (): string => 'Hello world!', // dummy
	},
	Mutation: {
		ping: (): string => 'Pong', // dummy
	},
};
