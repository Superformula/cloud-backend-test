import { gql } from "apollo-server-lambda";

const typeDefs = gql`
type Query {
    users: [User!]!
    geolocate: [GeolocalizedAddress!]
  }
  
  type Mutation {
    createUser(userInput: UserInput!): User!
    updateUser(_id: String!, userInput: UserInput!): User!
    deleteUser(_id: String!): Boolean!
  }
  
  
  type User {
      _id: ID!
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
  
  
  input UserInput {
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