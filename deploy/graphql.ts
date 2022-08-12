import * as cdk from '@aws-cdk/core';

export enum Environment {
  Production = 'prd',
  Staging = 'stg',
  QA = 'qa',
  Development = 'dev',
}

// StackProps interface
export interface StackProps extends cdk.StackProps {
  apiKey: string;
  environment: Environment;
  imageTag?: string;
  hostedZone: string;
  authority: string;
  serviceName: string;
}
