# Superformula Cloud Backend Test

> NOTE: The original README.md was moved to [instructions.md](./instructions.md)

## Tech Stack

- AWS CDK v2
- AppSync
- AWS Lambda
- DynamoDB

I know Terraform was the preferred _infrastructure as a code_ tool but AWS recently made the [CDK v2 generally available](https://aws.amazon.com/about-aws/whats-new/2021/12/aws-cloud-development-kit-cdk-generally-available/) on December 2021 and I wanted to try it out.

## Architecture

![Architecture](/assets/architecture.png 'Architecture')

The project is a 3-tier architecture with serverless resources: AppSync, Lambda functions and a DynamoDB table. For the simpler queries and mutations, DynamoDB resolvers are used to simplify and reduce the number of cloud components. On the other hand, where more logic is involved, such as in the update user mutation, a lambda resolver is used.

## Repository Structure

| Path                  | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `assets`              | Resources for documentation and local testing                |
| `bin`                 | Entrypoint for CDK                                           |
| `lib/api-stack.ts`    | Single stack with definition of all cloud resources required |
| `src/graphql`         | GraphQL schema definition                                    |
| `src/lambdas`         | Lambda functions source code                                 |
| `test`                | Test cases                                                   |
| `test/infrastructure` | Test the CDK cloud stack                                     |

## Environment Variables

There are 4 environment variables required. Create an `.env` file with the following, replacing the secrets.

```bash
MAPBOX_API_BASE_URL=https://api.mapbox.com/geocoding/v5/mapbox.places
MAPBOX_API_TOKEN=pk.secret
API_URL=https://secret.appsync-api.us-west-2.amazonaws.com/graphql
API_KEY=da2-secret
```

## Testing the API

You can test the GraphQL API with your favorite API Client. For example, if you use Insomnia you can [import the collection](/assets.Insomnia.json) from the assets folder.

![Using Insomnia to test GraphQL endpoints](/assets/insomnia.png 'Testing GraphQL Endpoints in Insomnia')

In Insomnia, in the Manage Environments window (`⌘ + E`), add the following environment variables and replace the secrets with the values given to you:

```json
{
  "apiUrl": "https://secret.appsync-api.us-west-2.amazonaws.com",
  "x-api-key": "da2-secret",
  "mapbox-key": "pk.secret"
}
```

## Testing a subscription

In our GraphQL Schema we have a subscription for when an user is updated (created or deleted).

Let's see how we can use Postman to test it, using the [WebSockets beta feature introduced in
v8.5](https://blog.postman.com/postman-supports-websocket-apis/).

- Create a new WebSocket request
- Enter the server URL

  ```
  wss://secret.appsync-realtime-api.us-west-2.amazonaws.com/graphql
  ```

- In the _Params_ tab, add a header and a payload.

  | Key     | Value     |
  | ------- | --------- |
  | header  | ewogIC... |
  | payload | e30=      |

  Note: the header must be the base64 encoded value of an object containing the host and api-key.

  ```json
  {
    "host": "secret.appsync-api.us-west-2.amazonaws.com",
    "x-api-key": "da2-secret"
  }
  ```

- In the _Headers_ tab, add the following:
  | Key | Value |
  | ------- | --------- |
  | x-api-key | da2-secret |
  | host | secret.appsync-api.us-west-2.amazonaws.com |
  | Sec-WebSocket-Protocol | graphql-ws |

- Connect to the web socket

- Before we can subscribe to anything, we need to send this message

  `{ "type": "connection_init" }`

- Create a new `start` message with the desired subscription:

  ```
  {
    "id":"replace-with-random-guid",
    "payload":{
        "data": "{\"query\":\"subscription onUserUpdated {\\n userUpdated {\\n id\\n }\\n }\",\"variables\":{}}",
        "extensions":{
            "authorization": {
                "x-api-key":"da2-secret",
                "host":"secret.appsync-api.us-west-2.amazonaws.com"
            }
        }
    },
    "type":"start"
  }
  ```

Now that you have your socket listening in, when you trigger a mutation to create an user a new message should appear with the id of the new user.

![Received message on a subscriptino](/assets/user-updated.png 'Testing the user updated subscription')

## Deploying with the CDK

Requirements:

- AWS Account ID
- User with programmatic access (access key and secret)
- Save your access key and secret locally using `aws configure`

Since this is the first time you will be deploying the CDK stack, you need to [bootstrap](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html) the environment. Bootstrapping is the process of provisioning resources the CDK needs to do the deployments, such as an S3 bucket for storing files and IAM roles that grant permissions needed to perform deployments. More info in the [docs](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html).

```shell
cdk bootstrap --trust=ACCOUNT_ID --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess --verbose
```

With the `--trust` flag we indicate CDK it can use that account ID for deployments.

To test you can run `ckd diff` to see all the resources the CDK will create once you deploy.

```shell
cdk diff
```

Deploy the changes to AWS with:

```shell
cdk deploy
```

Navigate to the AWS Console > AppSync to see the newly created `users-api`.

You can see the full list of cloud resources involved in the project in `cdk.out/ApiStack.template.json`.

## Next Steps

- The Location lambda has the MapBox token as an environment variable as plain text. It would be nice to protect the secret with KMS instead.
- Typify the events and responses in the lambda functions
- Add a custom domain to AppSync now that it has been [recently introduced](https://aws.amazon.com/blogs/mobile/introducing-custom-domain-names-for-aws-appsync-apis/)
- Automate test for the subscription
- Increase and report test coverage
