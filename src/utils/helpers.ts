import { Logger } from "@aws-lambda-powertools/logger";
import { ApolloError } from "apollo-server";
import { GraphQLError } from "graphql";
import Container from "typedi";
import config from "../configs/config";
import { dataSources } from "../dataSources/datasources";
import { resolvers } from "../resolvers/resolvers";
import { typeDefs } from "../schema/schema";

/* istanbul ignore next */
export const buildApolloServerConfig = (): any => {
    return {
        typeDefs, 
        resolvers, 
        dataSources,
        debug: config.logs.level === 'DEBUG',
        formatError: (err: GraphQLError) =>
        {
            if(err.extensions.code == 'INTERNAL_SERVER_ERROR'){
                var logger = Container.get(Logger);
                logger.error(`Internal error occurred. Error: ${err}`);
                
                return new ApolloError('Unable to handle the request.', 'ERROR', {
                  token: 'INTERNAL_ERROR',
                });
            }
            return err;
        }
    }

}