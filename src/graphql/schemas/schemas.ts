import { gql } from "apollo-server-lambda";

const typeDefs = gql`
type Query {
    users(id: String, limit: Int, lastEvaluatedKey: String): UserOutput!
    geolocate(address: String): [GeolocalizedAddress!]
  }
  
  type Mutation {
    createUser(attributes: UserInputInsert!): User!
    updateUser(id: String!, attributes: UserInputUpdate!): User!
    deleteUser(id: String!): Boolean!
  }
  
  type UserOutput {
      items: [User],
      count: Int,
      lastEvaluatedKey: String
  }

  type User {
      id: ID!
      name: String!
      dob: String
      address: GeolocalizedAddress
      description: String
      createdAt: String
      updatedAt: String
      imageUrl: String
  }
  
  type GeolocalizedAddress {
      place: String!
      latitude: Float!
      longitude: Float!
  }
  
  
  input UserInputInsert {
      name: String!
      dob: String!
      address: AddressInput!
      description: String!
      imageUrl: String!
  }

  input UserInputUpdate {
    name: String
    dob: String
    address: AddressInput
    description: String
    imageUrl: String
  }
  
  input AddressInput {
      place: String!
      latitude: Float!
      longitude: Float!
  }
    
`;

export default typeDefs;