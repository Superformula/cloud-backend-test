import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CloudStack from '../../lib/api-stack';

describe('', () => {
  let template : cdk.assertions.Template;

  beforeAll(() => {
    const app = new cdk.App();
    const stack = new CloudStack.ApiStack(app, 'MyTestStack');
    template = Template.fromStack(stack);
  })

  test('Location Lambda Created', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Handler: "index.handler",
      Runtime: "nodejs14.x",
      });
  });

  test('Users DynamoDB Table Created', () => {
    template.hasResourceProperties('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          "AttributeName": "id",
          "KeyType": "HASH"
        }
      ],
    });
  });
})
