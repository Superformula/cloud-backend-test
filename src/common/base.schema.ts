import { gql } from 'apollo-server-express'

const typeDefs = gql`
  scalar Upload
  scalar JSON
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`

export { typeDefs as baseDefs }
