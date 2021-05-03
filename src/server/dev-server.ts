import { ApolloServer } from 'apollo-server';
import { apolloServerConfig } from './misc/apollo-server-config';

const PORT = process.env.PORT || 4000;

const server = new ApolloServer(apolloServerConfig);

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}...`);
});
