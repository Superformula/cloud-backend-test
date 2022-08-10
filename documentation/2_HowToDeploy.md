## Deployment guide

### Welcome to CDK TypeScript project

  You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`DevGraphQLStack`)
  which contains a Lambda Function and API Gateway.

  The `cdk.json` file tells the CDK Toolkit how to execute your app.<p>&nbsp;</p>

### What prerequisites do I need to deploy the service?

  1. Install node and awscli, follow this [link](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) to confugure aws.
  
  2. Install cdk, `npm install aws-cdk`
    This same depedency is mentioned in `package.json` as well, but installing ahead for cdk bootstrap purposes

  3. Run `cdk bootstrap aws://<YOUR_AWS_ACCOUNT>/<YOUR_AWS_REGION>` which will set up a deployment environment on AWS you can use with your default AWS credentials. For example, `cdk bootstrap aws://1234567/us-east-1`

  Note: Keep in mind not to install extra packages other than prd dependencies in `package.json`, because of lambda 250MB limitation, for more [details](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)


### <u>How to deploy CDK stack</u>

  deploy.sh script to deploy cdk stacks to Dev, QA, STG, PRD environments.

  `deploy.sh` script is to deploy CDK stacks to AWS
    - pass these as command line arguments for `deploy.sh`
    AWS_ACCESS_KEY_ID - <YOUR_AWS_ACCESS_KEY_ID>
    AWS_SECRET_ACCESS_KEY - <YOUR_AWS_SECRET_ACCESS_KEY>

  eg:, from the root dir:
  ```bash
  AWS_ACCESS_KEY_ID=<YOUR_AWS_ACCESS_KEY_ID> AWS_SECRET_ACCESS_KEY=<YOUR_AWS_SECRET_ACCESS_KEY> bash deploy/deploy.sh
  ```
  Grab GraphQL endpoint from cdk output.

  Example output
  ```bash
  Outputs:
  DevGraphQLStack.graphqlEndpoint711CBBBD = https://6holtoh5t4.execute-api.us-east-1.amazonaws.com/prod/
  ```
  <p>&nbsp;</p>

### Troubleshooting

  1.verify cloudformation stack with right resources like lambda, api gaeway deployed in AWS
  2. Clod watch logs are helpful to debug any issues

### Useful commands

  - `npm run build` compile typescript to js
  - `npm run watch` watch for changes and compile
  - `npm run test` perform the jest unit tests
  - `cdk deploy` deploy this stack to your default AWS account/region
  - `cdk diff` compare deployed stack with current state
  - `cdk synth` emits the synthesized CloudFormation template

  NOTE: To deploy, you will need to run `cdk bootstrap` which will set up a deployment environment on AWS you can use with your default AWS credentials.

  - cdk deploy deploy this stack to your default AWS account/region, in graphql case, stack is going to be Lambda Function, Lambda Layer, IAM Role, Policy, API Gateway etc..
  - cdk diff compare deployed stack with current state
  - cdk synth emits the synthesized CloudFormation template to ./cdk.out

  [Layers](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html#layers): using lambda layers to provision code to Lambda function which are node modules.
  Check [here](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-lambda-readme.html#bundling-asset-code) for more details.<p>&nbsp;</p>

