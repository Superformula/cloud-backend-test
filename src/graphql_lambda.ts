import 'reflect-metadata';
import {ApolloServer, ApolloError} from 'apollo-server-lambda';
import {ApolloServerPluginLandingPageLocalDefault, Config} from 'apollo-server-core'
import { typeDefs } from './schema/schema';
import { resolvers } from './resolvers/resolvers';
import {dataSources} from './dataSources/datasources'
import config from './configs/config';
import Container from 'typedi';
import { Client } from '@googlemaps/google-maps-services-js';
import { Logger, injectLambdaContext } from '@aws-lambda-powertools/logger';
import middy from '@middy/core';

const logger = new Logger({logLevel: 'INFO', serviceName: 'locationService'});

Container.set({id: Logger, value: logger});
Container.set({id: Client, value: new Client()});


const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    dataSources,
    debug: config.logs.level === 'DEBUG',
    formatError: (err) =>
    {
        console.log(err);
        if(err.extensions.code == 'INTERNAL_SERVER_ERROR'){
            return new ApolloError('Unable to handle the request.', 'ERROR', {
              token: 'INTERNAL_ERROR',
            });
        }
        return err;
    },
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ]
    
});
export const  handler = middy(server.createHandler()).use(injectLambdaContext(logger));
