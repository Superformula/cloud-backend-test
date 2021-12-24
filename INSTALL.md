# Superformula Cloud Backend Test ** HOW TO INSTALL **


## Installing the Tools

1. install aws cli

https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

2. install terraform

https://learn.hashicorp.com/tutorials/terraform/install-cli


## Building and deploying the resources with TERRAFORM
3. type the commands bellow to build the AppSync on AWS

RUN:
> terraform init

> terraform plan

> terraform apply

4. confirm deployment typing "yes"


## Using AMPLIFY to prototype the API
5. get the AppSync graphql API id 

RUN:
> aws appsync list-graphql-apis

6. get the API key

RUN:
> aws appsync list-api-keys --api-id [YOUR_API_ID_THAT_YOU_GOT_ABOVE]

7. install amplify

RUN:
> npm install -g @aws-amplify/cli

RUN:
> amplify init

8. you will be asked to answer a few questions about the environment, it should be similar to the one below or different depending on your consumer app:

Project information
| Name: superformula
| Environment: dev
| Default editor: Visual Studio Code
| App type: javascript
| Javascript framework: none
| Source Directory Path: src
| Distribution Directory Path: dist
| Build Command: npm.cmd run-script build
| Start Command: npm.cmd run-script start

9. Enter your AWS credentials in the console (if you choose access key you'll see the text bellow)

Select the authentication method you want to use: AWS access keys
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
? region:  us-east-1

10. generate the files

RUN:
> amplify add codegen --apiId [THE_API_ID_THAT_YOU_GOT_BEFORE]

11. you will be asked to answer a few questions about you consumer application, it should be similar to the one below or different depending on your consumer app:

√ Getting API details
Successfully added API superformula to your Amplify project
? Choose the code generation language target typescript
? Enter the file name pattern of graphql queries, mutations and subscriptions src\graphql\**\*.ts
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2
? Enter the file name for the generated code src\API.ts
? Do you want to generate code for your newly created GraphQL API Yes
√ Downloaded the schema
√ Generated GraphQL operations successfully and saved at src\graphql
√ Code generated successfully and saved in file src\API.ts


## Running integration tests


