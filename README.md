I think that this project can definetly show what a dev can do.
In the beggining I had the wrong approach, trying to learn Terraform to deliver almost everything with it.

But it was cool gave me a new view of IaC. Mostly in my day to day operation I focus on services and scalability, so sorry if I didn't mind all that much about the CI/CD part, it's just that with the time constrain I did not want to go with the trial and error to setup everywhing by myself. But that's something that we should go over in out talk to make sure that it is in my scope.\n

# Superformula Cloud Backend Test

Be sure to read **all** of this document carefully, and follow the guidelines within.

## What you will be building

Build a GraphQL API that can `create/read/update/delete` user data from a persistence store.

### User Model

```
{
  "id": "xxx",                  // user ID (must be unique)
  "name": "backend test",       // user name
  "dob": "",                    // date of birth
  "address": "",                // user address
  "description": "",            // user description
  "createdAt": "",              // user created date
  "updatedAt": "",              // user updated date
  "imageUrl": ""                // user avatar image url
}
```

### Requirements

#### Functionality

- [x] The API should follow typical GraphQL API design pattern
	- The schema itself is pretty short, I did not care about the mutations (I'll get into it later), so basically we have the select queries entirely on the GraphQL part of the project
- [x] The data should be saved in the DB
	- DynamoDb was used
- [x] Proper error handling should be used
	- The lambda functions are managing errors correctly, I think that this is enough to show how extensibe the error management that I implemented can be
- [x] Paginating and filtering (by name) users list
	- Query on graphql endpoint. Since the pageSize is 6, all DynamoDb queries have a consumption ob 0.5 read capacity. Combining it with a caching system (prefferably Elasticache) the reading cost would be even lower
	- I think that in order for me to explain my table partition logic we shoud talk ;)
- [x] The API must have a Query to fetch geolocation information based off an address
	- This is how I imagine this endpoint being hit. The user has already called listUsers, and upon clicking in a single user, we'd call the getItem (pk and sk) and when the frontend has the user's addres, this endpoint would be called with the following format { address: string: provider: string }

#### Tech Stack
  - [x] **Use Typescript**
	- OK
  - [x] **Use Infrastructure-as-code tooling** that can be used to deploy all resources to an AWS account. Examples:
    - [x] **Terraform (preferred)**
    - CloudFormation / SAM
    - [x] Serverless Framework
    - Feel free to use other IaC tooling if you prefer
  - [x] Use **AWS Lambda + API Gateway (preferred)** or AWS AppSync
	- BOTH were used
  - [x] Use any AWS Database-as-a-Service persistence store. **DynamoDB is preferred.**
	- Dynamo was used
  - [x] Location query must use [NASA](https://api.nasa.gov/api.html) or [Mapbox](https://www.mapbox.com/api-documentation/) APIs to resolve the coordinate based on the address; use AWS Lambda.
	- Nasa was NOT used
	- MapBox was
	- and we can add other providers by taking advantage of the abstract class **GeolocationBase.ts**

#### Developer Experience 
- [x] Write unit tests for business logic
	- I generated the code coverage, and intentionally did not finish it a 100% (for time sake)
- [x] Write concise and clear commit messages
- [x] Document and diagram the architecture of your solution
	- a draw.io image is attached in the solution's DIAGRAM folder
- [x] Write clear documentation:
    - [x] Repository structure
    - [ ] Environment variables and any defaults.
    - [x] How to build/run/test the solution
    - [ ] Deployment guide
	- the DOCUMENTATION folder has individual documents to go further in each project's section
    
#### API Consumer Experience
- [x] GraphQL API documentation
- [x] Ensure your API is able to support all requirements passed to the consumer team

### Bonus

These may be used for further challenges. You can freely skip these; feel free to try out if you feel up to it.

#### Developer Experience (in order)

- [ ] E2E Testing
	- none
- [ ] Integration testing
	- none
- [x] Code-coverage report generation
	- not complete, but generated
- [x] Describe your strategy for Lambda error handling, retries, and DLQs
- [x] Describe your cloud-native logging, monitoring, and alarming strategy across all queries/mutations
- [x] Online interactive demo with a publicly accessible link to your API
	- the insomnia queries collection??
- [x] Brief description of the frameworks/tools used in the solution
- [x] Optimized lambda build
	- lambda layer is composed of the solution's git package javascript version
- [x] Commit linting
- [ ] Semantic release


#### API Consumer Experience (in order)

- [x] Document how consumers can quickly prototype against your APIs
    - [ ] GraphQL Playground setup
    - [x] Insomnia setup
    - [ ] Feel free to use any other tool/client you might know that enable consumers to prototype against your API
- [x] GraphQL Documentation Generation
	- also in the DOCUMENTATION folder, done with https://app.graphqleditor.com/
- [x] Client API generation


## Client context

- Client will be performing real-time search against this API
	- **MY MAIN CONCERN**, I think that the thing that really sells my point was the DynamoDb speed over size. With the replication that was implemented, we can make sure that all queries consumes the least amount of read capacity
	- The write capacity I'd spreadout with a queue service, so we dont burst the read capacity quota
- List of users should be updated automatically after single user is updated
	- AppSync could have managed that, basically there is a socket implementation that shouts back to the front

## What We Care About

Use any libraries that you would normally use if this were a real production App. Please note: we're interested in your code & the way you solve the problem, not how well you can use a particular library or feature.

_We're interested in your method and how you approach the problem just as much as we're interested in the end result._
