# Superformula Cloud Backend Test

## About




### Document Purpose

The current document contains information related to developers that would like to run, test, and even extend this project.

Having in consideration that the present project is the result of the Superformula hiring process, I sent the corresponding "Design & Architecture" document to [Chloe Knapper](https://www.linkedin.com/in/chloeknapper/) by email. The document includes a dedicated sections to each requirement bullet in addition to a DEMO link.

## Project description

GraphQL service based on Apollo Server v2 running in serverless mode. Specifically, the API runs as AWS lambda with a corresponding API Gateway, a Dynamodb as storage, and an integration to the Mapbox platform.

The services provide CRUD operations for the 'user' entity and a geocode query function to get a geolocalized address from a string.

## Design aspects

### Reusability

The CRUD services were developed as generic services, to speed up the extension of this service by adding support for CRUDs operations of other models without having the develop the identical resolvers over and over again.


For instance, to extend the service to support CRUD operations of a new model, the existing CRUDs services can be reused by copy and pasting the existing ones

| *Mutation/user.ts*
```js
  export const user = {
    async createUser(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.create(ModelEnum.user, args);
    },
  
    async updateUser(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.update(ModelEnum.user, args);
    },

    async deleteUser(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.delete(ModelEnum.user, args);
    },
  }
  ```

| *Query/user.ts* 

```js
  async users(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.read(ModelEnum.user, args);
    },
```

and just changing "ModelEnum.user" by "ModelEnum.newModel".
As you can see, the CRUD operations are MODEL agnostic, making them reusable.

### GraphQL Philosophy

One of the great purposes of GraphQL is to create an endpoint to support as many client apps UI use cases as possible, without demanding them to receive all model attributes if some of those just need a few.

Following this concept, I built a query named "users' to support the following use cases:
- [x] User list (with and without paging)
- [x] Get one user by id
- [x] Get users by name (paging suport as well).


### Paging

The 'users' query returns an extra parameters named "lastEvaluatedKey". This parameter must be combined with the 'Limit' one to use paging functionality.
Receiving a non-null value in "lastEvaluatedKey", means that more items are matching the executed search query. This must be included on the following query execution to receive the next item list page.


## Prerequisites

* Development and local testing
    * Docker
    * Node.js environment (v14.x or above is preferred)
    * Mapbox account and access_token. [Mapbox](https://mapbox.com)
    * yarn
    * npm
    * npx
* Extras for deployments to AWS
    * aws developer account
    * aws cli



## Development

### Setup


- **Clone the repo**
- **Install dependencies**

  ```bash
  yarn install
  ```

- **Provide you mapbox key**
  
  Update the 'MAPBOX_ACCESS_TOKEN' environment variable in the serverless.yml file.

  ```js
      {
        "MAPBOX_ACCESS_TOKEN": "YOUR_KEY_HERE"
      }
  ```

- **Preparation for e2e testing and running the service locally**

  Dynamodb deployment in local docker environment

  ```bash
  npm run docker:local-db
  ```

  | *NOTE* Before running this command, ensure you have installed and running Docker on your machine.

- **Unit Test**

  ```bash
  npm run test:unit
  ```
- **Integration Test**

  ```bash
  npm run test:integration
  ```

- **e2e Test**
  ```bash
  npm run test:e2e
  ```
  | *NOTE* There is an existing issue related to the background services after running the e2e are not killed properly. So, the workaround, until the bug is fixed, will require killing it manually or restarting the machine. 


### Deployments

- **local**

  ```bash
  npm run local
  ```

- **Explorer and play with the service**

  The GraphQL Playground is enabled in a non-prod environment to lets you explore the schema and execute queries and mutations.
  After executing "npm run local" you will be able to access the Playground tool on http://localhost:3000/dev/playground


  | *NOTE* Add the following header attribute on the "HATTP HEADERS" section of the Playground tool.
  ```js
      {
        "x-api-key": "super-formula-api-key-token"
      }
  ```

- **aws**

  - **aws cli setup**

    ```bash
    aws configure
    ```

    | *NOTE* Please configure your AWS-CLI in this way only. Please, avoid including the key in this project code.

  - **deploy**

    The following command creates an s3 in AWS, packages the code, uploads it, creates the API gateway, and creates the Dynamdb database. This also connects these resources to the AWS CloudWatch monitoring service

    ```bash
    npm run deploy
    ```

    At the end of the process, you will see the URL for the API gateway that exposes this GraphQL lambda service. Please, remember to add the header key

  - **destroy**
    ```bash
    npm run destroy
    ```

## Monitoring

### Apollo Studio

The service can be monitored in Apollo Studio

![Aplolo Studio Monitoring Dashboard](./images/ApolloStudio.png)

You need to add the Apollo keys to the env varables in ./serverless.yml file

```javascript
  APOLLO_KEY: "[YOUR_KEY]"
  APOLLO_GRAPH_VARIANT: [YOUR_ENVIRONMENT]
  APOLLO_SCHEMA_REPORTING: true
```

| *NOTE* To obtain a graph API key go [here](https://www.apollographql.com/docs/studio/setup-analytics/#pushing-traces-from-apollo-server).

### Datadog

You can send metrics to the Datadog platform as well to monitor your service.

![Apollo Studio Monitoring Dashboard](./images/Datadog.png)

| *NOTE* To know how to connect your Apollo Dashboard to Datadog go [here](https://www.apollographql.com/docs/studio/datadog-integration/#gatsby-focus-wrapper).

## Miscellaneous
### Commands

- `npm run lint` Runs eslint
- `npm run test:unit` Execute the unit tests
- `npm run test:integration` Run the integration tests
- `npm run test:e2e` Run the e2e tests
- `npm run docker:local-db` Deploy the Dynamo db in the local docker
- `npm run local` Deploy the Dynamo db in the local docker and run the lambda locally
- `npm run deploy` Deploy the services to AWS
- `npm run destroy` Destroy the related services from AWS

## Pendings
- More scenarios for unit, integration and e2e tests
- Fix the problem of killing the childprocess after the e2e testing excution
- CI/CD by using git actions or circleCi
