# Superformula Cloud Backend Test ** HOW TO INSTALL **


## Installing the Tools

1. install aws cli

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

2. install terraform

https://learn.hashicorp.com/tutorials/terraform/install-cli


## Building and deploying the resources with TERRAFORM

1. init teraform

RUN:
> terraform init

2. validate and plan your terraform template

RUN:
> terraform validate

RUN:
> terraform plan

3. apply and create the resources on AWS

RUN:
> terraform apply

4. confirm deployment typing "yes" when requested


## Using AMPLIFY to prototype the API
1. list the AppSync graphql APIs to obtain the api-id

RUN:
> aws appsync list-graphql-apis

2. get the API key

RUN:
> aws appsync list-api-keys --api-id [THE_API_ID_THAT_YOU_GOT_ABOVE]

3. install amplify

RUN:
> npm install -g @aws-amplify/cli

RUN:
> amplify init

4. you will be asked to answer a few questions about the environment, it should be similar to the one below:

Project information
| Name: `superformula`
| Environment: `dev`
| Default editor: `Visual Studio Code`
| App type: `javascript`
| Javascript framework: `none`
| Source Directory Path: `src`
| Distribution Directory Path: `dist`
| Build Command: `npm.cmd run-script build`
| Start Command: `npm.cmd run-script start`

5. Enter your AWS credentials in the console (if you choose access key you'll see the text bellow)

Select the authentication method you want to use: AWS access keys
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
? region:  us-east-1

6. generate the files

RUN:
> amplify add codegen --apiId [THE_API_ID_THAT_YOU_GOT_BEFORE]

7. you will be asked to answer a few questions about you consumer application, it should be similar to the one below:

√ Getting API details
Successfully added API superformula to your Amplify project
? Choose the code generation language target `typescript`
? Enter the file name pattern of graphql queries, mutations and subscriptions `src\graphql\**\*.ts`
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions `Yes`
? Enter maximum statement depth [increase from default if your schema is deeply nested] `2`
? Enter the file name for the generated code `src\API.ts`
? Do you want to generate code for your newly created GraphQL API `Yes`
√ Downloaded the schema
√ Generated GraphQL operations successfully and saved at src\graphql
√ Code generated successfully and saved in file src\API.ts


## Running tests

## Enabling Logs on AWS

1. Sign in to the AWS AppSync console.

2. Choose Settings from the navigation panel.

3. Under Logging, click the toggle to Enable Logs.

4. When the console prompts you, provide or create a CloudWatch ARN role.

5. Optionally, Choose to configure the Field resolver log level from the list.

6. Choose Save. The logging is automatically configured for your API.

7. visit https://docs.aws.amazon.com/appsync/latest/devguide/monitoring.html for more details.


