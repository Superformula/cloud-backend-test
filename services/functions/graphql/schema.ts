import { MapboxGeoCoder } from '@cloud-backend-test/core/mapbox';
import {
  builder,
} from './builder';
import {
  CoordinateType,
} from './types/coordinate';

builder.objectType(Error, {
  name: 'Error',
  fields: (t) => ({
    message: t.exposeString('message'),
  }),
});

builder.queryType({
  fields: (t) => ({
    coordinate: t.field({
      type: CoordinateType,
      errors: {
        types: [ Error ],
      },
      args: {
        address: t.arg.string({ required: true }),
      },
      resolve: async (_, args) => {
        return new MapboxGeoCoder().getCoordinatesByAddress(args.address);
      },
    }),
  }),
});

export const schema = builder.toSchema({});
