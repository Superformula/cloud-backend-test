import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import { Construct } from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as gql from './graphql';
// import _ from 'lodash';
// import * as ec2 from '@aws-cdk/aws-ec2';

const createTagger =
  (tags: { [key: string]: string }) => (taggable: Construct) =>
    Object.keys(tags).map((tag) => cdk.Tags.of(taggable).add(tag, tags[tag]));

export class GraphqlLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: gql.StackProps) {
    super(scope, id, props);
    const tagIt = createTagger({
      env: props.environment,
      'provisioned-by': 'cdk',
      service: 'graphql',
      Name: `${props.environment}-${props.env?.region}-${props.serviceName}`,
    });
    // The code that defines your stack goes here
    const layer = new lambda.LayerVersion(this, 'NpmModulesLayer', {
      code: new lambda.AssetCode('nodejs.zip'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_12_X],
      description: 'A layer to package modules',
    });

    // If you want, you can configure own VPC, subnets, SGs when creating
    // Lambda function.

    // const vpc = ec2.Vpc.fromLookup(this, 'Vpc', {
    //   vpcId: props.vpcId,
    // });
    // const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(
    //   this,
    //   'GraphQLSG',
    //   'sg-0e8485c6cad5d3be7',
    //   {
    //     mutable: false,
    //   }
    // );
    const graphqlLambda = new lambda.Function(this, 'MessageHandler', {
      functionName: 'GraphQLLambda',
      description: 'Process GraphQL requests',
      // Where our lambda function is located
      code: new lambda.AssetCode('dist'),
      // What should be executed once the lambda is invoked
      // - in that case, the `handler` function exported by `handler.ts`
      handler: 'handler.handler',
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: Duration.seconds(300),
      environment: {
        AUTHORITY: props.authority,
        API_KEY: props.apiKey,
        HIVE_TOKEN: props.hiveToken,
      },
      layers: [layer],
      // vpc: vpc,
      // vpcSubnets: {
      //   subnets: _.filter(vpc.privateSubnets, (subnet) => {
      //     return props.subnetIds.includes(subnet.subnetId);
      //   }),
      // },
      // securityGroups: [securityGroup]
    });
    tagIt(graphqlLambda);
    const apiGatewayLambdaRestApi = new apiGateway.LambdaRestApi(
      this,
      'graphqlEndpoint',
      {
        handler: graphqlLambda,
      }
    );
    tagIt(apiGatewayLambdaRestApi);
  }
}
