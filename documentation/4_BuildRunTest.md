# How to build/run/test the solution

#### What prerequisites do I need to run the service?

  >Install node and awscli, follow this [link](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) to confugure aws.
  
  >Install cdk, `npm install -g aws-cdk`

  >Install dependencies

  ```bash
  npm install
  ```

#### How to build the project


  ```bash

  tsc

  # Or

  npm run build # Compile typescript to js
  ```

  All typescript files are compiled into a `dist` folder and the project is run from there.<p>&nbsp;</p>

#### How to run unit and integration tests

  > First you need API_KEY in root level .env file for some tests, follow below link

#### How to generate API_KEY in Google Cloud Console?

  > Follow this [link](https://developers.google.com/maps/documentation/geocoding/get-api-key) to create API key and restrict to use it for Geocoding API

  Use below command to run tests
  `$ npm run test`

  Note: Some tests start its own Apollo server.<p>&nbsp;</p>

### How to run queries in Postman

  Start the server locally(ref: How to start server locally) first. Make a Post call using `localhost:3000/graphql` in Postman using below sample query

  ```
  query Address($addressId: ID!) {
      address(id: $addressId) {
          longitude
          latitude
      }
  }
  ```

  variables

  ```json
  {
    "addressId": "29 Main St Watertown, MA 02472"
  }
  ```

  For Headers, plugin jwt token like `Bearer ey..`

### How to start server locally

  > Use below command to start server

  `$ npm run start:concurrent`


### code coverage report

  > Used nyc - https://github.com/istanbuljs/nyc
  if you run `npm run cover:report`, it will generate `index.html` where you can see code coverage report. I have included screenshot under screenshots folder.

  <p>&nbsp;</p>
  Note: For tests, I am starting a separate graphql server to avoid port collisions (instead of using server from index.ts, but using same resolvers, typedefs) when running multiple tests together because of time/deadline limitations.
