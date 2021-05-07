# Users Lambda

This readme will explain the project structure and detail some functionality of the lambda function developed to handle GraphQL requests

## Project Structure

This lambda was developed using Typescript and NodeJS. The following scripts were provided on the package.json:

- `npm test`: run unit and integration tests
- `npm run gen-types`: generate code based on the defined GraphQL schema
- `npm run build`: Transpile the source code to a dist folder using development settings. Ensuring the gen-types script is run before building.
- `npm run pack`: Create a ZIP package using the trace-pkg package.

This GraphQL project contains 5 main folders.:

- graphql - contains graphql schema definitions, types used in Apollo configuration and resolvers declarations
- mappers - this folder contains definitions for mappers to be used when converting database models to graphql schema models
- data-access - contains declarations related to the data access layer of the application
  - models: contains interfaces that models the application data.
  - repositories: contains services that are responsible for accessing a data source and returning a proper data model.
- config: Contains functions responsible for reading the environment and providing objects with the configuration.
- tests - contains the integration tests files

The lambda handler is declared on the lambda.ts file.

## GraphQL API

This project setups a GraphQL playground upon deployment. This way you can prototype and check the schema documentation using the playground editor.

### Schema types generation

The Typescript types for the GraphQL schema are automatically generated using the [GraphQL code generator](https://www.graphql-code-generator.com/) and are outputted on graphql/schema/types/schema-types.ts.

### User queries

```
type Query {
    user(id: ID!): User!
    users(query: String, limit: Int!, cursor: String): UsersPage!
}

type UsersPage {
    items: [User!]!
    cursor: String
}

type User {
    id: ID!
    name: String!
    address: String!
    dob: String!
    description: String
    createdAt: String!
    updatedAt: String
    imageUrl: String
}
```

There a 2 user queries implemented:

- `user(id: ID!): User!`

  Returns an user with the specified id

- `users(query: String, limit: Int! = 10, cursor: String): UsersPage!`

  Returns a page of users with page size of `limit`. The `query` parameter will filter the results so that the returned users all have their name attributes equal to `query` (an exact match).

  To obtain the first page, do not pass the cursor parameter for this query. For each subsequent page you need to pass the the cursor returned by the previous page.

  Example:

  Supose we have the following users in the database

  ```
  {
      "id": "8868ee93-368c-4a08-bd97-c646033c386d",
      "name": "Fernando Nunes"
  },
  {
      "id": "cb9684a4-aef4-4d3e-b72a-d5ec576b4d32",
      "name": "Fernando Nunes 2"
  }
  ```

  To get the first page:

  ```
  # Query
  query {
    users(limit: 1) {
      items {
        id
        name
      }
      cursor
    }
  }

  # Result
  "users": {
      "items": [
        {
          "id": "8868ee93-368c-4a08-bd97-c646033c386d",
          "name": "Fernando Nunes"
        }
      ],
      "cursor": "<Cursor to second page>"
    }

  ```

  Now, to get the next page we will pass the `<Cursor to second page>` value returned on the previous response to the request of the next page:

  ```

  # Query
  query {
    users(limit: 1, cursor: <Cursor to second page>) {
      items {
        id
        name
      }
      cursor
    }
  }

  # Result
  "users": {
      "items": [
        {
          "id": "cb9684a4-aef4-4d3e-b72a-d5ec576b4d32",
          "name": "Fernando Nunes 2"
        }
      ],
      "cursor": "<Cursor to next page>"
    }

  ```

### Geolocation Query

By using the forward geocoding API of mapbox we can obtain the coordinate of an address. The schema for this query follows:

```
type Query {
    geolocation(query: String!): GeolocationData
}

type GeolocationData {
    latitude: Float!
    longitude: Float!
}

```

The query parameter can be any address, like '221B Baker Street, London, England', and will return a set of coordinates (latitude and longitude).

### User mutations

Mutation for the user were provided in order to enable user creation, update and deletion.

```
type Mutation {
  createUser(data: UserInput!): User!
  updateUser(id: ID!, data: UserInput!): User!
  deleteUser(id: ID!): User
}

input UserInput {
  name: String
  address: String
  description: String
  dob: String   # This date must be on 'YYYY-MM-DD' notation
}
```

## Tests

Unit tests were implemented on all business logic classes and functions using [jest](https://www.npmjs.com/package/jest) package.

Integration tests were implemented using [apollo-server-testing](https://www.npmjs.com/package/apollo-server-testing) package. This is a work in progress, more tests must be implemented in the future to exercise Geolocation queries.
You can find the tests on the [tests folder](./tests)

### Running the tests

Run the script: `npm test`

### Code coverage

To generate a code coverage report, run: `npm test -- --collect-coverage`

This will create a `coverage` folder in this repository (this folder is ignored by source control). There you can see a detailed report generated by jest.
