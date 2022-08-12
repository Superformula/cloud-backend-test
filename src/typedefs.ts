import fs from 'fs';

export const typeDefs = fs.readFileSync('./schema.graphql', {
  encoding: 'utf-8',
});
