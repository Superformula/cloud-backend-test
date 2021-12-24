terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "default"
  region  = "us-east-1"
}

resource "aws_appsync_graphql_api" "superformula" {
  authentication_type = "API_KEY"
  name                = "superformula"
  schema              = <<EOF
schema {
query: Query
mutation: Mutation
subscription: Subscription
}

type Mutation {
createUser(input: CreateUserInput!): User
deleteUser(input: DeleteUserInput!): User
updateUser(input: UpdateUserInput!): User
}

type Query {
getUser(id: String!): User
listUsers(filter: TableUserFilterInput, limit: Int, nextToken: String): UserConnection
getCoordinates(address: String!, accessToken: String!): Coordinates
}

type Subscription {
onCreateUser(address: String, description: String, dob: String, id: String, name: String): User @aws_subscribe(mutations : ["createUser"])
onDeleteUser(address: String, description: String, dob: String, id: String, name: String): User @aws_subscribe(mutations : ["deleteUser"])
onUpdateUser(address: String, description: String, dob: String, id: String, name: String): User @aws_subscribe(mutations : ["updateUser"])
}

type User {
address: String
createdAt: String
description: String
dob: String
id: String!
imageUrl: String
name: String
updatedAt: String
}

type UserConnection {
items: [User]
nextToken: String
}

type Coordinates {
lat: Float
lon: Float
description: String
}

input CreateUserInput {
address: String
createdAt: String
description: String
dob: String
imageUrl: String
name: String
updatedAt: String
}

input DeleteUserInput {
id: String!
}

input UpdateUserInput {
address: String
createdAt: String
description: String
dob: String
id: String!
imageUrl: String
name: String
updatedAt: String
}

input TableBooleanFilterInput {
eq: Boolean
ne: Boolean
}

input TableFloatFilterInput {
between: [Float]
contains: Float
eq: Float
ge: Float
gt: Float
le: Float
lt: Float
ne: Float
notContains: Float
}

input TableIDFilterInput {
beginsWith: ID
between: [ID]
contains: ID
eq: ID
ge: ID
gt: ID
le: ID
lt: ID
ne: ID
notContains: ID
}

input TableIntFilterInput {
between: [Int]
contains: Int
eq: Int
ge: Int
gt: Int
le: Int
lt: Int
ne: Int
notContains: Int
}

input TableStringFilterInput {
beginsWith: String
between: [String]
contains: String
eq: String
ge: String
gt: String
le: String
lt: String
ne: String
notContains: String
}

input TableUserFilterInput {
address: TableStringFilterInput
createdAt: TableStringFilterInput
description: TableStringFilterInput
dob: TableStringFilterInput
id: TableStringFilterInput
imageUrl: TableStringFilterInput
name: TableStringFilterInput
updatedAt: TableStringFilterInput
}

EOF
}

resource "aws_dynamodb_table" "user" {
  name         = "user_${aws_appsync_graphql_api.superformula.id}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name        = "user"
    Environment = "production"
  }
}


resource "aws_appsync_api_key" "superformula" {
  api_id = aws_appsync_graphql_api.superformula.id
}

resource "aws_iam_role" "superformula_dynamodb_user_role" {
  name = "superformula_dynamodb_user_role_${aws_appsync_graphql_api.superformula.id}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "appsync.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "superformula_dynamodb_user_role_policy" {
  name = "superformula_dynamodb_user_role_policy_${aws_appsync_graphql_api.superformula.id}"
  role = aws_iam_role.superformula_dynamodb_user_role.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_dynamodb_table.user.arn}"
      ]
    }
  ]
}
EOF
}

resource "aws_appsync_datasource" "superformula_dynamodb_datasource_user" {
  api_id           = aws_appsync_graphql_api.superformula.id
  name             = "superformula_dynamodb_datasource_user"
  service_role_arn = aws_iam_role.superformula_dynamodb_user_role.arn
  type             = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.user.name
  }
}

resource "aws_appsync_resolver" "superformula_createuser_resolver" {
  api_id      = aws_appsync_graphql_api.superformula.id
  field       = "createUser"
  type        = "Mutation"
  data_source = aws_appsync_datasource.superformula_dynamodb_datasource_user.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "PutItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($util.autoId()),
  },
  "attributeValues": $util.dynamodb.toMapValuesJson($ctx.args.input),
  "condition": {
    "expression": "attribute_not_exists(#id)",
    "expressionNames": {
      "#id": "id",
    },
  },
}
EOF

  response_template = <<EOF
$util.toJson($context.result)
EOF
}

resource "aws_appsync_resolver" "superformula_updateuser_resolver" {
  api_id      = aws_appsync_graphql_api.superformula.id
  field       = "updateUser"
  type        = "Mutation"
  data_source = aws_appsync_datasource.superformula_dynamodb_datasource_user.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "UpdateItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
  },

  ## Set up some space to keep track of things we're updating **
  #set( $expNames  = {} )
  #set( $expValues = {} )
  #set( $expSet = {} )
  #set( $expAdd = {} )
  #set( $expRemove = [] )

  ## Iterate through each argument, skipping keys **
  #foreach( $entry in $util.map.copyAndRemoveAllKeys($ctx.args.input, ["id"]).entrySet() )
    #if( $util.isNull($entry.value) )
      ## If the argument is set to "null", then remove that attribute from the item in DynamoDB **

      #set( $discard = $${expRemove.add("#$${entry.key}")} )
      $!{expNames.put("#$${entry.key}", "$${entry.key}")}
    #else
      ## Otherwise set (or update) the attribute on the item in DynamoDB **

      $!{expSet.put("#$${entry.key}", ":$${entry.key}")}
      $!{expNames.put("#$${entry.key}", "$${entry.key}")}
      $!{expValues.put(":$${entry.key}", $util.dynamodb.toDynamoDB($entry.value))}
    #end
  #end

  ## Start building the update expression, starting with attributes we're going to SET **
  #set( $expression = "" )
  #if( !$${expSet.isEmpty()} )
    #set( $expression = "SET" )
    #foreach( $entry in $expSet.entrySet() )
      #set( $expression = "$${expression} $${entry.key} = $${entry.value}" )
      #if ( $foreach.hasNext )
        #set( $expression = "$${expression}," )
      #end
    #end
  #end

  ## Continue building the update expression, adding attributes we're going to ADD **
  #if( !$${expAdd.isEmpty()} )
    #set( $expression = "$${expression} ADD" )
    #foreach( $entry in $expAdd.entrySet() )
      #set( $expression = "$${expression} $${entry.key} $${entry.value}" )
      #if ( $foreach.hasNext )
        #set( $expression = "$${expression}," )
      #end
    #end
  #end

  ## Continue building the update expression, adding attributes we're going to REMOVE **
  #if( !$${expRemove.isEmpty()} )
    #set( $expression = "$${expression} REMOVE" )

    #foreach( $entry in $expRemove )
      #set( $expression = "$${expression} $${entry}" )
      #if ( $foreach.hasNext )
        #set( $expression = "$${expression}," )
      #end
    #end
  #end

  ## Finally, write the update expression into the document, along with any expressionNames and expressionValues **
  "update": {
    "expression": "$${expression}",
    #if( !$${expNames.isEmpty()} )
      "expressionNames": $utils.toJson($expNames),
    #end
    #if( !$${expValues.isEmpty()} )
      "expressionValues": $utils.toJson($expValues),
    #end
  },

  "condition": {
    "expression": "attribute_exists(#id)",
    "expressionNames": {
      "#id": "id",
    },
  }
}
EOF

  response_template = <<EOF
$util.toJson($context.result)
EOF
}

resource "aws_appsync_resolver" "superformula_deleteuser_resolver" {
  api_id      = aws_appsync_graphql_api.superformula.id
  field       = "deleteUser"
  type        = "Mutation"
  data_source = aws_appsync_datasource.superformula_dynamodb_datasource_user.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "DeleteItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.input.id),
  },
}
EOF

  response_template = <<EOF
$util.toJson($context.result)
EOF
}

resource "aws_appsync_resolver" "superformula_getuser_resolver" {
  api_id      = aws_appsync_graphql_api.superformula.id
  field       = "getUser"
  type        = "Query"
  data_source = aws_appsync_datasource.superformula_dynamodb_datasource_user.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "GetItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id),
  },
}
EOF

  response_template = <<EOF
$util.toJson($context.result)
EOF
}

resource "aws_appsync_resolver" "superformula_listusers_resolver" {
  api_id      = aws_appsync_graphql_api.superformula.id
  field       = "listUsers"
  type        = "Query"
  data_source = aws_appsync_datasource.superformula_dynamodb_datasource_user.name

  request_template = <<EOF
{
  "version": "2017-02-28",
  "operation": "Scan",
  "filter": #if($context.args.filter) $util.transform.toDynamoDBFilterExpression($ctx.args.filter) #else null #end,
  "limit": $util.defaultIfNull($ctx.args.limit, 20),
  "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null)),
}
EOF

  response_template = <<EOF
$util.toJson($context.result)
EOF
}


resource "aws_appsync_datasource" "superformula_mapbox_datasource" {
  api_id = aws_appsync_graphql_api.superformula.id
  name   = "superformula_mapbox_datasource"
  type   = "HTTP"

  http_config {
    endpoint = "https://api.mapbox.com"
  }
}


resource "aws_appsync_resolver" "superformula_getcoordinates_resolver" {
  api_id      = aws_appsync_graphql_api.superformula.id
  field       = "getCoordinates"
  type        = "Query"
  data_source = aws_appsync_datasource.superformula_mapbox_datasource.name

  request_template = <<EOF
#set($search = $util.urlEncode($ctx.args.address))
{
    "version": "2018-05-29",
    "method": "GET",
    "resourcePath": $util.toJson("/geocoding/v5/mapbox.places/$${search}.json"),
    "params":{
        "query": { 
            "limit": 1,
            "access_token": $util.toJson($ctx.args.accessToken)
        }
    }
}
EOF

  response_template = <<EOF
#if($ctx.result.statusCode == 200)
	#set($objJson = $util.parseJson($ctx.result.body))
    #set($features = $objJson.features)    
	#if($features.size() > 0)
        $utils.toJson({ "lat": $features[0].center[0], "lon": $features[0].center[1],  "description": $features[0].place_name  })
    #else
    	null
    #end
#else
    $utils.appendError($ctx.result.body, $ctx.result.statusCode)
#end
EOF
}