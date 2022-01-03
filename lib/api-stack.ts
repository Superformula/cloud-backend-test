import cdk = require('aws-cdk-lib')
import { CfnGraphQLApi, CfnApiKey, CfnGraphQLSchema, CfnDataSource, CfnResolver } from 'aws-cdk-lib/aws-appsync'
import { Table, AttributeType, StreamViewType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { Role, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import { join } from 'path'
import { readFileSync } from 'fs'
require('dotenv').config()

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // Schema.fromAsset() from CDK v1 is no longer available in v2 🤷‍♂️
    const schema = readFileSync(join(__dirname, '..', 'src', 'graphql', 'schema.graphql')).toString()

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, '..', 'src', 'lambdas', 'package-lock.json'),
      runtime: Runtime.NODEJS_14_X,
    }

    const getLocationLambda = new NodejsFunction(this, 'getLocationFunction', {
      entry: join(__dirname, '..', 'src', 'lambdas', 'get-location.ts'),
      environment: {
        MAPBOX_API_TOKEN: process.env.MAPBOX_API_TOKEN || '',
        MAPBOX_API_BASE_URL: process.env.MAPBOX_API_BASE_URL || 'https://api.mapbox.com/geocoding/v5/mapbox.places',
      },
      ...nodeJsFunctionProps,
    })

    const usersGraphQLApi = new CfnGraphQLApi(this, 'UsersApi', {
      name: 'users-api',
      authenticationType: 'API_KEY',
    })

    new CfnApiKey(this, 'UsersApiKey', {
      apiId: usersGraphQLApi.attrApiId,
    })

    const apiSchema = new CfnGraphQLSchema(this, 'UsersSchema', {
      apiId: usersGraphQLApi.attrApiId,
      definition: schema,
    })
    // TODO Add updateUser schema and resolver

    const usersTable = new Table(this, 'UsersTable', {
      tableName: 'users',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_IMAGE,

      // TODO Change to RETAIN for production
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    })

    const usersTableRole = new Role(this, 'UsersDynamoDBRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    usersTableRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'))

    const lambdaRole = new Role(this, 'LambdaRole', {
      assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
    })

    lambdaRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AWSLambda_FullAccess'))

    // Data Sources

    const dataSource = new CfnDataSource(this, 'UsersDataSource', {
      apiId: usersGraphQLApi.attrApiId,
      name: 'UsersDynamoDataSource',
      type: 'AMAZON_DYNAMODB',
      dynamoDbConfig: {
        tableName: usersTable.tableName,
        awsRegion: this.region,
      },
      serviceRoleArn: usersTableRole.roleArn,
    })

    const dataSourceLocationLambda = new CfnDataSource(this, 'LocationDataSource', {
      apiId: usersGraphQLApi.attrApiId,
      name: 'LocationLambdaDataSource',
      type: 'AWS_LAMBDA',
      lambdaConfig: {
        lambdaFunctionArn: getLocationLambda.functionArn,
      },
      serviceRoleArn: lambdaRole.roleArn,
    })

    // Resolvers

    const getLocationResolver = new CfnResolver(this, 'GetLocationQueryResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Query',
      fieldName: 'getLocation',
      dataSourceName: dataSourceLocationLambda.name,
    })
    getLocationResolver.addDependsOn(apiSchema)

    const getUserResolver = new CfnResolver(this, 'GetUserQueryResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Query',
      fieldName: 'getUser',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "GetItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
    getUserResolver.addDependsOn(apiSchema)

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
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
    listUsersResolver.addDependsOn(apiSchema)

    const createUserResolver = new CfnResolver(this, 'CreateUserMutationResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Mutation',
      fieldName: 'createUser',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "PutItem",
        "key": {
          "id": { "S": "$util.autoId()" }
        },
        "attributeValues": {
          "name"        : $util.dynamodb.toDynamoDBJson($ctx.args.user.name),
          "dob"         : $util.dynamodb.toDynamoDBJson($ctx.args.user.dob),
          "address"     : $util.dynamodb.toDynamoDBJson($ctx.args.user.address),
          "description" : $util.dynamodb.toDynamoDBJson($ctx.args.user.description),
          "imageUrl"    : $util.dynamodb.toDynamoDBJson($ctx.args.user.imageUrl),
          "createdAt"   : $util.dynamodb.toDynamoDBJson($util.time.nowISO8601()),
          "updatedAt"   : $util.dynamodb.toDynamoDBJson($util.time.nowISO8601())
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
    createUserResolver.addDependsOn(apiSchema)

    const deleteUserResolver = new CfnResolver(this, 'DeleteMutationResolver', {
      apiId: usersGraphQLApi.attrApiId,
      typeName: 'Mutation',
      fieldName: 'deleteUser',
      dataSourceName: dataSource.name,
      requestMappingTemplate: `{
        "version": "2017-02-28",
        "operation": "DeleteItem",
        "key": {
          "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
        }
      }`,
      responseMappingTemplate: `$util.toJson($ctx.result)`,
    })
    deleteUserResolver.addDependsOn(apiSchema)
  }
}
