# Superformula Cloud Backend Test - Manan Habib

## Table of contents

- [Technical stack](#tech-stack);
- [Architecture](#architecture);
- [Project Structure](#repo-structure);
- [Useful Environment Variables](#env-variables);
- [Setting up your environment and building/running/testing the solution](#setting-up);
- [GraphQL documentation and playground](#graphql-docs-and-playground);
- [Description of some of the frameworks/tools used in the solution](#frameworks-and-tools);
- [Test bonuses](#bonuses)
- [Further improvements](#further-improvements);

## Technical stack

- [**Node.js**](https://nodejs.org/en/) as runtime
- [**Typescript**](https://www.typescriptlang.org/) as programming language
- [**API Gateway**](https://aws.amazon.com/api-gateway/) to expose API
- [**AWS Lambda**](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) as compute service
- [**AWS CloudWatch**](https://aws.amazon.com/cloudwatch) for logging 
- [**GraphQL**](https://graphql.org/) as specification to develop API using **Apollo Server**
- [**Terraform**](https://www.terraform.io/) as IaC

## Architecture
As the image shows, we have serverless architecture of this project built upon amazon web services.
the first entry point for request is **Api Gateway** which redirects the request to corresponding lambda 
function. After gateway, **AWS Lambda**, gets the request and this is the actual component where request gets
processed and response is generated for user. It is the building block of serverless architecture where on each 
request a lambda gets triggered, serves the response and gets killed. While process of request in lambda, all the 
logs and traces being generated get saved in **AWS Cloudwatch service**.

To get the coordinates against given address, **Google geocoding api** is being used. Lambda function directly communicates
with this service to fetch the location data. 

![solution-overall-architecture](./proj-arch.svg)

## Project Structure
Following is the directories arrangememnt in folder:
```
.
├───coverage                # Code coverage report. Jest produce results in this folder.
├───iac                     # All the terraform files reside in this directory
│   ├───aws
│       ├───api_gateway     # Contains .terraform files for api gateway
│       └───lambda          # Contains tf files for aws lambda and its role
├───src
│   ├───configs             # Implementation around env files and global configs
│   ├───dataSources         # Apollo server data sources implementation to wire requests to services
│   ├───resolvers           # Graphql Query/Mutation resolvers implementation
│   │   └───coordinates
│   ├───schema              # Implementation around graphql schema
│   ├───services            # Contains services implementation which makes core business logic of app
│   └───utils               # Contains helper/reusable functions 
└───tests
    ├───e2e                 # Contains End to end tests
    └───unit                # Contains unit tests
        
```
## Environment Variables
Following are the important environment variables to be set to run the application. For the scope of this project
I have added env files for dev, test and aws environments having variables set in it. (Although, env files shouldn't
be part of git repo and deployments variable should be in terraform.)
```
NODE_ENV             # Environment of the app
GOOGLE_MAPS_KEY      # Api key for maps api
LOG_LEVEL            # Log level of the application

```

## Building and running(Locally)

To manage the build and ship, some npm commands have been implemented in *package.json* file.
#### Install required packages
In order to install required packages, run following command in project root directory:
```
npm install
```
This will generate assets in *./build* folder.
#### Build
In order to build the project and generate assets for deployment, run:
```
npm run build
```
This will generate assets in *./build* folder.

#### Run tests
In order to run the test and generate coverage report:
```
npm test
```
This will generate CLI report as well as report assets in *./coverage* folder.

This will generate CLI report as well as report assets in *./coverage* folder.
#### Run locally
In order to run the app locally, hit:
```
npm start
```
This will host application locally on default 4000 port.
#### Deploy to aws
In order to run the app locally, hit:
```
npm run aws-deploy
```
This command will automate the whole building and shipping process using the CLI. On running this, 
it will build the assets, run all the test suites, generate a coverage report, create the zipped dist package,
create/update the terraform plan and apply it to deploy it to aws. Upon successful deplpyment, you
shoudl be seeing lambda url in CLI output.
