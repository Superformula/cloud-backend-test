// import { resolvers } from '../../resolvers/coordinates';
// import DATA from '../utilities/testData';
// import * as chai from 'chai';
// import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
// import { ERROR_MESSAGES } from '../../conf/constants';
// chai.use(chaiShallowDeepEqual);
// const expect = chai.expect;

// describe('Resolver tests', () => {
//   it('should be able to return results', () => {
//     const res = resolvers.Query.address(null, { name: DATA.ADDRESS }, {});
//     expect(res).to.shallowDeepEqual({
//       name: '29 Main St Watertown, MA 02472',
//     });
//   });

//   it('should be able to return longitude', async () => {
//     const res = await resolvers.Address.longitude({ name: DATA.ADDRESS });
//     expect(res).to.equal(-71.18494799999999);
//   });

//   it('should be able to return latitude', async () => {
//     const res = await resolvers.Address.latitude({ name: DATA.ADDRESS });
//     expect(res).to.equal(42.366192);
//   });

//   it('should be able to throw error for partial address', async () => {
//     try {
//       await resolvers.Address.longitude({ name: DATA.INCOMPLETE_ADDRESS });
//     } catch (err) {
//       expect(err).to.shallowDeepEqual(
//         `Error: ${ERROR_MESSAGES.INCOMPLETE_ADDRESS}`
//       );
//     }
//   });

//   it('should be able to throw error for partial address', async () => {
//     try {
//       await resolvers.Address.latitude({ name: DATA.INCOMPLETE_ADDRESS });
//     } catch (err) {
//       expect(err).to.shallowDeepEqual(
//         `Error: ${ERROR_MESSAGES.INCOMPLETE_ADDRESS}`
//       );
//     }
//   });

//   it('should be able to throw error for bad address', async () => {
//     try {
//       await resolvers.Address.latitude({ name: DATA.BAD_ADDRESS });
//     } catch (err) {
//       expect(err).to.shallowDeepEqual(
//         `Error: ${ERROR_MESSAGES.INVALID_ADDRESS}`
//       );
//     }
//   });

//   it('should be able to throw error for bad address', async () => {
//     try {
//       await resolvers.Address.longitude({ name: DATA.BAD_ADDRESS });
//     } catch (err) {
//       expect(err).to.shallowDeepEqual(
//         `Error: ${ERROR_MESSAGES.INVALID_ADDRESS}`
//       );
//     }
//   });
// });
