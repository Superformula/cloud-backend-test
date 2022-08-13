import NodeGeocoder from 'node-geocoder';
import * as dotenv from 'dotenv';
// import { log } from '.';
import { ERROR_MESSAGES, INVALID_API_KEY_ERROR } from './conf/constants';
dotenv.config();

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
  } catch (err) {
    if (
      err instanceof Error &&
      err?.toString().includes(INVALID_API_KEY_ERROR)
    ) {
      throw new Error(ERROR_MESSAGES.INVALID_API_KEY);
    }
    throw err;
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
