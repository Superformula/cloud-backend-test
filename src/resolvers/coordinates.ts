// import { log } from '.';
// import { UserInputError } from 'apollo-server';
import { Context } from 'apollo-server-core';
import { getCoordinates } from '../calculateCoordinates';
import conf from '../conf';
import { GraphQLResolveInfo } from 'graphql';

// Resolvers define the technique for fetching the types defined in the
// schema.
// I read a doc, where each resolver making a different async call would be better compared
// to making one single async call
// because failing to get longitude should not impact latitude
// I am taking first address address[0], based on the assumption full address is given
// happy to extend to provide multiple addresses by mappiing through addresses array
export const resolvers = {
  Query: {
    address: (
      _parent: any,
      args: { id: string },
      _context: Context,
      _info?: GraphQLResolveInfo
    ) => ({
      id: args.id,
    }),
  },
  Address: {
    longitude: async ({ id }: { id: string }) => {
      try {
        const address = await getCoordinates(id, conf.apiKey);
        const longitude = address[0].longitude;
        return longitude;
      } catch (err) {
        // log.logger.error({
        //   message: 'Failed to get longitude from getCoordinates',
        //   err,
        // });
        throw err;
      }
    },
    latitude: async ({ id }: { id: string }) => {
      try {
        const address = await getCoordinates(id, conf.apiKey);
        const latitude = address[0].latitude;
        return latitude;
      } catch (err) {
        // log.logger.error({
        //   message: 'Failed to get latitude from getCoordinates',
        //   err,
        // });
        throw err;
      }
    },
  },
};
