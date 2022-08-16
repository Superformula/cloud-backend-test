#!/usr/bin/env node

import * as cdk from '@aws-cdk/core';

import { GraphqlLambdaStack } from '../deploy/graphql-stack';
import conf from '../src/conf';
import { Environment } from '../src/conf/config';

const account = conf.deployAccount;
const region = conf.deployRegion;
const hostedZone = process.env.DEPLOY_ZONE ?? 'us-east-1';

const authority = conf.jwtTokens.authority;
const environment = conf.env as Environment;
const serviceName = 'graphql';
const apiKey = conf.apiKey as string;
const hiveToken = conf.hiveToken as string;

class GraphQLCDKApp extends cdk.App {
  constructor() {
    super();

    new GraphqlLambdaStack(this, `${conf.stackName}`, {
      environment,
      env: {
        account,
        region,
      },
      hostedZone: hostedZone,
      authority,
      serviceName,
      apiKey,
      hiveToken,
    });
  }
}

const app = new GraphQLCDKApp();
app.synth();
