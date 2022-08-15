import path from 'path';
import {readFileSync} from 'fs';
import {gql} from 'apollo-server'

const schema = readFileSync(path.join(__dirname, './schema.graphql'));
export const typeDefs = gql`
    ${schema}
`