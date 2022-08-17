import { App } from '@serverless-stack/resources';
import { Api } from './Api';

/**
 * The CDK stack main function
 *
 * @param {App} app
 */
export default function main(app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
  });
  app.stack(Api);
}
