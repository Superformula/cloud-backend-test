import NodeGeocoder from 'node-geocoder';
import * as dotenv from 'dotenv';
// import { log } from '.';
import log from 'lambda-log';
import * as uuid from 'uuid';
import {
  ERROR_MESSAGES,
  INVALID_API_KEY_ERROR,
  INVALID_REQUEST_ERROR,
} from '../conf/constants';
dotenv.config();

export interface Error {
  name: string;
  message: string;
  stack?: string;
}

export enum ERROR_TYPE {
  INVALID_REQUEST_ERROR = 'INVALID_REQUEST_ERROR',
  INVALID_API_KEY_ERROR = 'INVALID_API_KEY_ERROR',
}

// I would write switch/case block for this instead of writing nested if
export const handleAcceptedErrors = (err: any): any => {
  log.error(`Failed to get coordinates: ${err}`);
  if (err?.toString().includes(INVALID_REQUEST_ERROR)) {
    return new Error(ERROR_MESSAGES.INVALID_ADDRESS);
  } else if (err?.toString().includes(INVALID_API_KEY_ERROR)) {
    return new Error(ERROR_MESSAGES.INVALID_API_KEY);
  } else if (err?.toString().includes(ERROR_MESSAGES.INVALID_ADDRESS)) {
    return new Error(ERROR_MESSAGES.INVALID_ADDRESS);
  } else if (err?.toString().includes(ERROR_MESSAGES.INCOMPLETE_ADDRESS)) {
    return new Error(ERROR_MESSAGES.INCOMPLETE_ADDRESS);
  }
  return new Error(`Internal Server Error with Tracking Id = ${uuid.v4()}`, {
    cause: {
      name: 'InternalServerError',
      message: 'Please check all required constraints are met!',
    },
  });
};

export const getCoordinates = async (
  address: string,
  apiKey: string
): Promise<NodeGeocoder.Entry[]> => {
  try {
    const options: NodeGeocoder.Options = {
      provider: 'google',
      // Optional depending on the providers
      httpAdapter: 'https', // Default
      apiKey, // for Mapquest, OpenCage, Google Premier
      formatter: null, // 'gpx', 'string', ...
    };
    const geocoder = NodeGeocoder(options);
    const fetchedAddr = await geocoder.geocode(address);
    if (fetchedAddr.length === 0) {
      throw new Error(ERROR_MESSAGES.INVALID_ADDRESS);
    }
    if (fetchedAddr.length > 1) {
      throw new Error(ERROR_MESSAGES.INCOMPLETE_ADDRESS);
    }
    return fetchedAddr;
  } catch (err: any) {
    const handledErr = handleAcceptedErrors(err);
    throw handledErr;
  }
};

// Alternative approach for async error handling
// https://thecodebarbarian.com/async-await-error-handling-in-javascript.html

// export const handleError = (err: Error) => {
//   console.error(err);
// };

// export const getCoordinatesCatch = async (
//   address: string
// ): Promise<NodeGeocoder.Entry[] | void> => {
//   const options = {
//     provider: 'google',
//     // Optional depending on the providers
//     httpAdapter: 'https', // Default
//     apiKey: process.env.API_KEY, // for Mapquest, OpenCage, Google Premier
//     formatter: null, // 'gpx', 'string', ...
//   };
//   const geocoder = NodeGeocoder(options as NodeGeocoder.Options);
//   return await geocoder.geocode(address).catch(handleError);
// };
