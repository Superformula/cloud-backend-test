#### Repository structure

  * deploy folder have deploy cdk and bash scripts
  * src folder where all the code lives, GraphQL API, typedefs, resolvers, config, tests 
    - conf - reusable config needed for code and tests like serviceName, port, audience, authority etc.
    - test - where all tests like unit and integration tests reside, utilities - is for utils needed for tests
    - All other files like resolvers.ts, typedefs.ts for Graphql, loggingPlugin - for logging etc
  * Other configuration files like tsconfig.json - configuration of the TS complier, mocharc.json for mocha, prettierrc.json for prettier etc

|-- bin    - Contains file to emit the synthesized CloudFormation template
|-- deploy - CDK deploy scripts
|-- documentation
|-- src  # Sources files where all the GraphQL code lives
    |-- conf  # Implementation around env files and global configs
    |-- tests
        |-- integration - Contains End to end tests
        |-- unit        - Contains unit tests
        |-- utilites    - Contains tests helpers/reusable functions
    |-- resolvers # Graphql Query/Mutation resolvers implementation
        |-- coordinates
    |-- typedefs.ts   - is a collection of type definitions
    |-- tsconfig.json - configuration of the TS complier
    |-- mocharc.json  - for mocha
    |-- prettierrc.json - for prettier
    |-- schema.graphql - Contains GraphQL schema.
    |-- hanler.ts      - lambda handler function
    |-- package.json - all depedencies