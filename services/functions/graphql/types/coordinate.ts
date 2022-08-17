import {builder} from '../builder';

export const CoordinateType = builder.simpleObject(
  'Coordinate',
  {
    fields: (t) => ({
      latitude: t.float({
        nullable: false,
      }),
      longitude: t.float({
        nullable: false,
      }),
    }),
  },
);
