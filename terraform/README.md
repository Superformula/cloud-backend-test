# Terraform configuration

This solution uses Terraform to manage infrastructure resources created in AWS.

The following resources are created:

- A lambda function using a pre-built package that should be placed on the packages folder on the parent directory
- A API gateway to act as a proxy that invokes the lambda function
- DynamoDB table to store the users
- A role to grant the correct policies to the lambda function for it to access the other AWS resources

The following input variables were defined on `variables.tf`:

- `users_table_name`: the name of the DynamoDB table that will be created. default: `Users`
- `user_name_index`: the name of the DynamoDB GSI that will be created on the name attribute of the users. default: `UserNameIndex`
- `gateway_stage`: the stage name to deploy this solution. default: `dev`
- `mapbox_access_token`: : the Mapbox access token that will be used when retrieving geolocation data.

The only output provided in this solution provides is `base_url`, which contains the invoke URL of the created API Gateway.
