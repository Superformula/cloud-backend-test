// import { ExpressContext } from 'apollo-server-express';

// export interface ExpressContextInterface {
//   event: any;
//   context: any;
//   express: ExpressContext;
// }

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

// // export const expressContextBuilder = ({
// //   event,
// //   context,
// //   express,
// // }: ExpressContextInterface) => {
// //   const token = express.req?.headers?.authorization || '';
// //   const user = { token };
// //   if (!user) throw new Error('you must be logged in');
// //   return { user };
// // };
