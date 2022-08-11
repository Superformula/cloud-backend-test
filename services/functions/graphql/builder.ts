import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import TracingPlugin from '@pothos/plugin-tracing';

export const builder = new SchemaBuilder({
  plugins: [
    TracingPlugin,
    SimpleObjectsPlugin,
    ErrorsPlugin,
  ],
  errorOptions: {
    defaultTypes: [],
  },
});

