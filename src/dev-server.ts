import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({ schema });

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}...`);
});
