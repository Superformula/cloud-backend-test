import { parse, Source, validate } from 'graphql';
import { schema } from '../..';

export function validationErrors(query: string) {
  const source = new Source(query, 'schema.graphql');
  const ast = parse(source);
  return validate(schema, ast);
}
