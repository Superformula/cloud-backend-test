import 'reflect-metadata';
import {ApolloServer, ServerInfo} from 'apollo-server';
import Container from 'typedi';
import { Client } from '@googlemaps/google-maps-services-js';
import {Logger} from '@aws-lambda-powertools/logger';
import { buildApolloServerConfig } from './utils/helpers';
import config from './configs/config';




Container.set({id: Logger, value: new Logger({logLevel: config.logs.level, serviceName: config.appName})});
Container.set({id: Client, value: new Client()});



const server = new ApolloServer(buildApolloServerConfig());

server
    .listen({port: config.port})
    .then(({url}: ServerInfo) => {
        console.log(`server running at ${url}`);
    })

    
    
