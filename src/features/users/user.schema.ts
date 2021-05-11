import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type User {
    id: String
    name: String
    dob: String
    address: String
    description: String
    imageUrl: String
    createdAt: String
    updatedAt: String
  }

  input CreateUserInput {
    name: String!
    dob: String!
    address: String!
    description: String
    image: Upload
  }

  input UpdateUserInput {
    id: String!
    name: String!
    dob: String!
    address: String!
    description: String
    image: Upload
  }

  input UserSearchInput {
    limit: Int
    skip: Int
    name: String
  }

  extend type Query {
    users(searchCriteria: UserSearchInput): [User]
    user(id: String): User
  }

  extend type Mutation {
    createUser(data: CreateUserInput!): User
    updateUser(data: UpdateUserInput): User
    deleteUser(id: String!): Boolean
  }
`
export { typeDefs }
