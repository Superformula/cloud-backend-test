import { createGQLHandler } from './gqlHandler';
import { schema } from './schema';

export const handler = createGQLHandler({
  schema,
});
