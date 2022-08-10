# Superformula Cloud Backend Test

Be sure to read **all** of this document carefully, and follow the guidelines within.

### Summary

Build a GraphQL API for geographical data to receive an arbitrary address and return its coordinates (Latitude and Longitude).

Example response:

```json
{
  "latitude": 37.821385,
  "longitude": -122.478779,
}
```

### Requirements

#### Functionality

1. The API should follow typical GraphQL API design patterns
1. Proper error handling should be used

#### Tech Stack
  - Use of **TypeScript** is required 
  - **Please use infrastructure-as-code tooling** that can be used to deploy all resources to AWS. 
    - Terraform (preferred)
    - CloudFormation / SAM
    - Serverless Framework
    - AWS CDK
  - Use **AWS Lambda** + **AWS API Gateway**
  - Location query must use [NASA](https://api.nasa.gov/), [Google Maps,](https://developers.google.com/maps) or [Mapbox](https://www.mapbox.com/api-documentation/) APIs to resolve the coordinate based on the address

#### Developer Experience 
- Write unit tests for business logic
- Write concise and clear commit messages
- Developers must be able to run and test this service locally
- Document and diagram the architecture of your solution
- Write clear documentation:
    - Repository structure
    - Environment variables and any defaults
    - How to build/run/test the solution
    - Deployment guide

### Bonus

These may be used for further challenges. You can freely skip these; feel free to try them out if you feel up to it.

#### Developer Experience

1. Code-coverage report generation
1. Online interactive demo with a publicly accessible link to your API

## What We Care About

Use any libraries that you would normally use if this were a real production App. Please note: we're interested in your code & the way you solve the problem, not how well you can use a particular library or feature.

_We're interested in your method and how you approach the problem just as much as we're interested in the end result._

Here's what you should strive for:

- Good use of current `TypeScript`, `Node.js`, `GraphQL` & performance best practices
- Solid testing approach
- Logging and traceability
- Extensible code and architecture
- A delightful experience for other backend engineers working in this repository
- A delightful experience for engineers consuming your APIs

## Q&A

> How should I start this code challenge?

Fork this repo to your own account and make git commits to add your code as you would on any other project.

> Where should I send back the result when I'm done?

Send us a pull request when you think you are done. There is no deadline for this task unless otherwise noted to you directly.

> What if I have a question?

Create a new issue [in this repo](https://github.com/Superformula/cloud-backend-test/issues) and we will respond and get back to you quickly.

> I am almost finished, but I don't have time to create everything that is required

Please provide a plan for the rest of the things that you would do.
