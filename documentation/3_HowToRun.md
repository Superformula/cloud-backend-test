### How to run
  Once Stack is deployed, access API Gateway in Postman. First update Lambda configuration environment variables with the right API key. By providing right jwt token, you can access GraphQL API by appending `/graphql` at the end.

  #### How to generate API_KEY in Google Cloud Console?

  > Follow this [link](https://developers.google.com/maps/documentation/geocoding/get-api-key) to create API key and restrict to use it for Geocoding API

### GraphQL Endpoint

  For example, you can hit `https://6holtoh5t4.execute-api.us-east-1.amazonaws.com/prod/graphql` and make queries with the right JWT token.

