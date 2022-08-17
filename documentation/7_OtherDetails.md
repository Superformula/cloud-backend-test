## Other Information

#### Environment variables and any defaults

  > API_KEY - plug it in root level .env file

  > From my past experience, I have provisioned API_KEY using GOCD env variables, GitHub hooks Environment Variables, AWS SSM. For this project, once lambda is deployed, feel free to set the value of API_KEY in lambda>configuration>environment variables. Plese check `buildRunTest.md` about how to generate your own API_KEY.

#### Auth

  > Used Jwt Auth for securing GraphQL API, created API in Auth0, more details are in `config.ts`.

#### How to generate JWT Token

  > You can make curl request to create JWT using JWT config from `config.ts`, or use `check.test.ts` to generate a valid JWT token.
  Happy to provide JWT token in a secure way or disable auth if there is any trouble generating token. 
  In Auth0, I have created API with the identifier.

#### Assumptions

  > Took Assumption to provide full address, given partial or bad address - throwing helpful error.

#### Commented code

  > I left some commented code intentionally to show that i have tried some nice libraries, but they didn't work.

#### Questions

  > Do you use type-graphql, i have noticed this package when i am trying type resolver args, it looks nice, just didn't get chance to use it since it looks like i need to make good amount of changes
