// import { ExpressContext } from 'apollo-server-express';
import { getCoordinates } from './dataSources/calculateCoordinates';
import conf from './conf';
import log from 'lambda-log';

export interface ExpressContextInterface {
  event: any;
  context: any;
  express: any;
}

// export interface ContextBuilder {
//   headers: any;
//   functionName: any;
//   event: any;
//   context: any;
//   expressRequest: any;
// }

// // export const expressContextBuilder = ({
// //   event,
// //   context,
// //   express,
// // }: ExpressContextInterface): ContextBuilder => ({
// //   headers: event.headers,
// //   functionName: context.functionName,
// //   event,
// //   context,
// //   expressRequest: express.req,
// // });

export const expressContextBuilder = ({ event, context, express }: any) => {
  console.log('event:', event);
  console.log('context:', context);
  console.log('express req headers:', express?.req?.headers);
  console.log('express req body:', express?.req.body?.variables.name);
  log.info(`express req ${express?.req}`);
  const token = express?.req?.headers?.authorization || '';
  const user = { token };
  if (!user) throw new Error('you must be logged in');
  // const address = await getCoordinates(
  //   express?.req.body?.variables.name,
  //   conf.apiKey
  // );
  // console.log('address in resolver:', address);
  // return { address: address[0] };
};
