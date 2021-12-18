import cdk = require('aws-cdk-lib');
import { CfnGraphQLApi, CfnApiKey, CfnGraphQLSchema, CfnDataSource, CfnResolver } from 'aws-cdk-lib/aws-appsync';
import { Table, AttributeType, StreamViewType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class ApiStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'users'

    const usersGraphQLApi = new CfnGraphQLApi(this, 'UsersApi', {
      name: 'users-api',
      authenticationType: 'API_KEY'
    });

    new CfnApiKey(this, 'UsersApiKey', {
      apiId: usersGraphQLApi.attrApiId
    });

    const apiSchema = new CfnGraphQLSchema(this, 'UsersSchema', {
      apiId: usersGraphQLApi.attrApiId,
      definition: `type User {
        id: ID!
        name: String!
        dob: AWSDate
        address: String
        description: String
        createdAt: AWSDateTime
        updatedAt: AWSDateTime
        imageUrl: AWSURL
      }
      input UserInput {
        id: ID!
        name: String!
        dob: AWSDate
        address: String
        description: String
        imageUrl: AWSURL
      }
      type PaginatedUsers {
        users: [User!]
        nextToken: String
      }
      type Query {
        listUsers(limit: Int, nextToken: String): PaginatedUsers!
        getUser(id: ID!): User
      }
      type Mutation {
        createUser(user: UserInput!): User
        deleteUser(id: ID!): User
      }
      type Schema {
        query: Query
        mutation: Mutation
      }`
    });

    const usersTable = new Table(this, 'UsersTable', {
      tableName: tableName,
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,

      // TODO Change to RETAIN for production
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const usersTableRole = new Role(this, 'UsersDynamoDBRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com')
    });

    usersTableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    // Data Source

    const dataSource = new CfnDataSource(this, 'UsersDataSource', {
      apiId: usersGraphQLApi.attrApiId,
      name: 'UsersDynamoDataSource',
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: usersTable.tableName,
        awsRegion: this.region
      },
      serviceRoleArn: usersTableRole.roleArn
    });

    // Resolvers

    const getUserResolver = new CfnResolver(this, 'GetUserQueryResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Query',
      fieldName: 'getUser',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "PK": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    getUserResolver.addDependsOn(apiSchema);

    const listUsersResolver = new CfnResolver(this, 'ListUsersQueryResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Query',
      fieldName: 'listUsers',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "Scan",
        "limit": $util.defaultIfNull($ctx.args.limit, 20),
        "nextToken": $util.toJson($util.defaultIfNullOrEmpty($ctx.args.nextToken, null))
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    listUsersResolver.addDependsOn(apiSchema);

    const createUserResolver = new CfnResolver(this, 'CreateUserMutationResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Mutation',
      fieldName: 'createUser',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "PK": { "S": "$util.autoId()" }
        },
        "attributeValues": {
          "name": $util.dynamodb.toDynamoDBJson($ctx.args.name)
          "dob": $util.dynamodb.toDynamoDBJson($ctx.args.dob)
          "address": $util.dynamodb.toDynamoDBJson($ctx.args.address)
          "description": $util.dynamodb.toDynamoDBJson($ctx.args.description)
          "imageUrl": $util.dynamodb.toDynamoDBJson($ctx.args.imageUrl)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    createUserResolver.addDependsOn(apiSchema);

    const deleteUserResolver = new CfnResolver(this, 'DeleteMutationResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Mutation',
      fieldName: 'deleteUser',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "DeleteItem",
        "key": {
          "PK": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`
    });
    deleteUserResolver.addDependsOn(apiSchema);
  }
}
