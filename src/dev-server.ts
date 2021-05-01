import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';
import { UserRepo } from './repositories/user-repo';

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
	schema,
	dataSources: () => ({
		userRepo: new UserRepo(),
	}),
});

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}...`);
});
