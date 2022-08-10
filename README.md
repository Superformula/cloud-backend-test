# Superformula Cloud Backend Test Solution

### Summary

This repository contains the solution for Superformula Cloud Backend Test. It is a GraphQL API that retrieves coordinates for a given address. The solution has been designed to comply with the requirements of extensible code and architecture, followed by Logging and traceability as well as solid testing.

## Solid Principles
* Single responsibility principle:
  * Controllers and services only handle one use case
* Open closed principle:
  * By using the decorator pattern (LogController) we can add functionality to a controller without modifying it.
* Interface segregation principle:
  * Every controller, service and repository implement in full their interfaces
* Dependency Inversion principle:
  * Controller’s dependencies and service’s dependencies are abstractions (interfaces) rather than implementations. Concrete implementation of a third-party library or a http client depends on the abstractions created and not the other way around (the dependency is inverted)

## Design Patterns
* Factory
* Decorator
* Adapter
* Dependency Injection
* Composition root

## Methodologies
* TDD
* Clean architecture
* Conventional Commits
* Continuous integration
* Object Oriented Design

## Features
* Error handling
* Unit test
* Integration test
* Coverage test
* Extensible code
* Logging and traceability

## Handling error strategy:
* Operational errors: predictable run-time errors of correctly written programs that may happen at some point
* Programming errors: bugs developers introduce to the code.

Errors are handled differently in development and production environments for best utility purposes.

Error in development environment with stack trace

![Error in development](public/img/development%20error.png)

Error in production environment with customized message for the user

![Error in production](public/img/production%20error.png)

## Tech Stack
* Typescript
* Serverles Framework
* API Gateway + AWS Lambda
* GraphQL

## Architecture

### Component diagram

![Component diagram](public/img/Cloud%20Backed%20Test%20-%20Component%20Diagram.png)

### AWS Cloud diagram

![AWS Cloud diagram](public/img/Cloud%20Backed%20Test%20-%20AWS%20Cloud%20Diagram.png)

## Testing

To run the tests you can choose from the following commands:

```
npm run test:unit
```
This will run all unit tests

```
npm run test:integration    
```
This will run all integration tests

```
npm run test:ci    
```
This will run a coverage test

## Repository structure
The solution is structured in the following directories
```

├── src                 # Source files of the solution
    ├── data            # Handles all business logic of the solution
    ├── domain          # Defines business logic protocols, models, and errors
    ├── infrastructure  # Implements third-party libraries, http clients, access db
    ├── main            # Performs composition root by creating a dependency graph
    └── presentation    # Handles incoming requests
```

## Environment variables
```
ACCESS_TOKEN            # stores mapbox api access token
NODE_ENV                # stores the application environemnt (development | production)
```

## Build

To build the solution run the following command:
```
npm run build
```
This will create a build folder optimized for production

## Run the solution

To run the solution, you can choose from these two options:
```
npm run start:prod
```
This will run the project simulating production environment

```
npm run start:dev
```
This will run the project in development mode

## Deployment guide

Before deployment make sure to:
-	Have a mapbox api access token 
-	Have configured AWS credentials locally with AWS CLI: (https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

-	Install the serverless framework globally: npm install -g serverless (https://www.serverless.com/framework/docs/getting-started)
-	Have in an .env file your environment variables 

To deploy the application run the following command:
```
npm run deploy
```
This will build the project first, and then it will use the serverless framework to translate the serverless.yml file to a single CloudFormation template which is then shipped to AWS. 

## Developer Experience

### Code-coverage report

![AWS Cloud diagram](public/img/coverage%20test.png)

## Online interactive demo

https://fopb62y911.execute-api.us-east-1.amazonaws.com/dev/graphql

