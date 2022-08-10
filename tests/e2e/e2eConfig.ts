import 'reflect-metadata';
import {ApolloServer} from 'apollo-server';
import {buildApolloServerConfig} from '../../src/utils/helpers'
import Container from 'typedi';
import { Client } from '@googlemaps/google-maps-services-js';
import { Logger } from '@aws-lambda-powertools/logger';


Container.set({id: Logger, value: new Logger()}); //configuring empty logger
Container.set({id: Client, value: new Client()});

export const server = new ApolloServer(buildApolloServerConfig());