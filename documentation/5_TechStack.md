# Tech Stack

  Please refer package.json for all libraries details
  TypeScript, Node.js, GraphQL, Express etc..

### Libraries

  Used below Npm library to get longitude and latitude:
  https://github.com/nchaulet/node-geocoder#readme

  Created API Key in Google Cloud in order to use the above library

### Deployment tools
  
  My observations about infrastructure-as-code tooling

  1. Terraform, for me writing Terraform code is new, and my observation is need to write extra code for permissions like iam role policy
  and I noticed with cdk you can write less code, so I chose cdk tool and more time given happy to try terraform as well, this is the document I am referring to https://learn.hashicorp.com/tutorials/terraform/lambda-api-gateway

  2. CloudFormation / SAM - haven't tried.

  3. Serverless Framework, I have noticed apollo has documentation around serverless framework, for some reason I couldn't find integration with api gateway, I just saw lambda, this is the doc I referred https://www.apollographql.com/docs/apollo-server/deployment/lambda/

  4. AWS CDK is what i have used for deploying all resources to AWS.

### Logger

  Used loggingPlugin. Provided Screenshot from Lambda logs.

  Other loggers:
  1. https://www.envelop.dev/plugins/use-logger, couldn't set the custom plugin using envelop plugin

  ```js
  import { envelop, useLogger } from '@envelop/core';
  plugins: [useLogger({ logFn: () => logger })],
  ```

  2. graphql-pino-middleware

  ```js
  import graphqlPinoMiddleware from 'graphql-pino-middleware';
  create the graphql-pino-middleware
  const loggerMiddleware = graphqlPinoMiddleware({ logger: log });
  ```

  3. loggingMiddleware
  
  ```js
  const loggingMiddleware = (req: any, _res: any, next: any) => {
    console.log('ip:', req.ip);
    next();
  };
  ```
  If more time given, can explore above loggers as well.

  4. Couldn't use Pino logger, giving pino error like `FinalizationRegistry is not defined`, i have tried registering to Pino middleware as well, didn't work. Also with the latest Pino types, there are tsc errors.

### Traceability

  Tried Open Telemetry, but getting TS errors - couldn't succeed. Left commented code, given more time can explore some more.
  https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/
  https://github.com/open-telemetry/opentelemetry-js

  ```js
  const OpentracingPlugin = require('apollo-opentracing').default;
  ```

### GraphQL Hive

  For monitoring, https://docs.graphql-hive.com

### Validatios

    https://www.npmjs.com/package/graphql-constraint-directive - was playing aroud with this, but types are giving errors.
    https://www.apollographql.com/blog/backend/validation/graphql-validation-using-directives/

## Git Commits

  There is a standardized way in which to format commit messages:

  ```bash
  git commit -m "<type>(<scope>): <subject>"
  ```

  The different allowed types can be viewed in `package.json`

  ```bash
      "commitlint": {
          "types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"]
      }
  ```

  scope (optional): the file or component that was changed

  subject: the commit message

  Typing `npm run commit` will also prompt you to fill out an wizard that is presented to you.

## Auto Code Formatting

  When making commits, any files that have been modified will undergo auto code formatting using [prettier](https://prettier.io/) as a pre-commit hook.
  

