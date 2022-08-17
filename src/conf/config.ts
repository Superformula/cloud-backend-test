import * as dotenv from 'dotenv';
export enum Environment {
  Production = 'prd',
  Staging = 'stg',
  QA = 'qa',
  Development = 'dev',
}
dotenv.config({ path: `${__dirname}/.env` });
const conf = {} as Config;
export interface Config {
  hiveToken: string;
  stackName: string;
  env: string;
  deployAccount: string;
  deployRegion: string;
  subnetIds: (string | undefined)[];
  server: {
    port: number;
  };
  jwtTokens: {
    audience: string;
    authority: string;
  };
  apiKey: string;
  deployVpc: string;
}
conf.server = {
  port: Number(process.env.SERVICE_PORT ?? '3000'),
};

conf.jwtTokens = {
  audience: `http://localhost:${conf.server.port}/`,
  authority:
    process.env.JWT_TOKENS_AUTHORITY ?? 'https://dev-lds0lhjh.us.auth0.com/',
};

conf.apiKey = process.env.API_KEY ?? 'your-api-key';

conf.hiveToken = process.env.HIVE_TOKEN ?? 'your-hive-token';

conf.deployRegion = process.env.DEPLOY_REGION ?? 'us-east-1';

conf.env = (process.env.ENV_SHORT as Environment) ?? Environment.Development;
conf.stackName = process.env.STACK_NAME ?? 'DevGraphQLStack';

export default conf;
