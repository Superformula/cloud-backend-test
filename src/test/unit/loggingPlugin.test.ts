import { CachePolicy, SchemaHash } from 'apollo-server-types';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { GraphQLSchema, Kind, Location, OperationTypeNode } from 'graphql';
import { loggingPlugin } from '../../loggingPlugin';
chai.use(chaiShallowDeepEqual);

describe('LoggingPlugin tests', () => {
  it('should be able to return results', async () => {
    const requestContext = await loggingPlugin.requestDidStart({
      logger: {
        name: 'apollo-server',
        levels: {
          TRACE: 0,
          DEBUG: 1,
          INFO: 2,
          WARN: 3,
          ERROR: 4,
          SILENT: 5,
        },
      } as any,
      schema: {
        __validationErrors: [],
        extensions: {},
        astNode: {
          kind: Kind.SCHEMA_DEFINITION,
          operationTypes: [
            {
              kind: Kind.OPERATION_TYPE_DEFINITION,
              type: {
                kind: Kind.NAMED_TYPE,
                name: {
                  kind: Kind.NAME,
                  value: 'Query',
                  loc: {
                    start: 424,
                    end: 429,
                  } as Location,
                },
              },
              operation: OperationTypeNode.QUERY,
            },
          ],
        },
        extensionASTNodes: [],
        _queryType: 'Query',
        _directives: ['@include', '@skip', '@deprecated', '@specifiedBy'],
        _typeMap: {
          Query: 'Query',
          String: 'String',
          Address: 'Address',
          Float: 'Float',
          Boolean: 'Boolean',
          __Schema: '__Schema',
          __Type: '__Type',
          __TypeKind: '__TypeKind',
          __Field: '__Field',
          __InputValue: '__InputValue',
          __EnumValue: '__EnumValue',
          __Directive: '__Directive',
          __DirectiveLocation: '__DirectiveLocation',
        },
        _subTypeMap: {},
        _implementationsMap: {},
      } as unknown as GraphQLSchema,
      schemaHash:
        '473ef43080deffc89630c0db7ef550c4616d8e3f20822baab73fa78a4fefd1aa2ddcfc5c93d2913e2b214f4adb6b7f2309ff383ac89d926003625ce5c6c4ee3c' as SchemaHash,
      request: {
        query:
          'query Address($name: String!) {\n    address(name: $name) {\n        longitude\n        latitude\n    }\n}',
        variables: {
          name: '29 Main St Watertown, MA 02472',
        },
      },
      context: {},
      cache: {
        cache: {},
      } as any,
      debug: false,
      metrics: {},
      overallCachePolicy: {} as CachePolicy,
    });
    expect(typeof requestContext.parsingDidStart).to.equal('function');
    expect(typeof requestContext.validationDidStart).to.equal('function');
  });
});
