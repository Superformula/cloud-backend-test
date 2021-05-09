import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';

import { constructTestServer, mockedContext } from './__utils';


const GET_USER_BY_ID = gql`
query{
  users(
  	id: "fa8d7da0-af85-11eb-9859-577507baa6d7"
  ){
    items{
      id,
      name
    },
    lastEvaluatedKey
  }
}
`;



const mockedReadByIdDbResponse = {
  Items: [
    {
      name: 'New name',
      description: 'new desc',
      id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
      imageUrl: 'test.com'
    }
  ],
  Count: 1,
  ScannedCount: 21
};

describe('Queries', () => {
  it('user - read one by Id - success', async () => {
    
    const {server, geoDataStorage, storeDataStorage} = constructTestServer();

    mockedContext.db.scan.mockReturnValueOnce({
      promise: () => Promise.resolve(mockedReadByIdDbResponse)
    });

    const { query } = createTestClient(server);
    const res = await query({query: GET_USER_BY_ID});
    expect(res).toMatchSnapshot();
  });

  // it('fetches single launch', async () => {
  //   const {server, launchAPI, userAPI} = constructTestServer({
  //     context: () => ({user: {id: 1, email: 'a@a.a'}}),
  //   });

  //   launchAPI.get = jest.fn(() => [mockLaunchResponse]);
  //   userAPI.store = mockStore;
  //   userAPI.store.trips.findAll.mockReturnValueOnce([
  //     {dataValues: {launchId: 1}},
  //   ]);

  //   const {query} = createTestClient(server);
  //   const res = await query({query: GET_LAUNCH, variables: {id: 1}});
  //   expect(res).toMatchSnapshot();
  // });
});

// describe('Mutations', () => {
//   it('returns login token', async () => {
//     const {server, launchAPI, userAPI} = constructTestServer({
//       context: () => {},
//     });

//     userAPI.store = mockStore;
//     userAPI.store.users.findOrCreate.mockReturnValueOnce([
//       {id: 1, email: 'a@a.a'},
//     ]);

//     const {mutate} = createTestClient(server);
//     const res = await mutate({
//       mutation: LOGIN,
//       variables: {email: 'a@a.a'},
//     });
//     expect(res.data.login.token).toEqual('YUBhLmE=');
//   });

//   it('books trips', async () => {
//     const {server, launchAPI, userAPI} = constructTestServer({
//       context: () => ({user: {id: 1, email: 'a@a.a'}}),
//     });

//     // mock the underlying fetches
//     launchAPI.get = jest.fn();

//     // look up the launches from the launch API
//     launchAPI.get
//       .mockReturnValueOnce([mockLaunchResponse])
//       .mockReturnValueOnce([{...mockLaunchResponse, flight_number: 2}]);

//     // book the trip in the store
//     userAPI.store = mockStore;
//     userAPI.store.trips.findOrCreate
//       .mockReturnValueOnce([{get: () => ({launchId: 1})}])
//       .mockReturnValueOnce([{get: () => ({launchId: 2})}]);

//     // check if user is booked
//     userAPI.store.trips.findAll.mockReturnValue([{}]);

//     const {mutate} = createTestClient(server);
//     const res = await mutate({
//       mutation: BOOK_TRIPS,
//       variables: {launchIds: ['1', '2']},
//     });
//     expect(res).toMatchSnapshot();
//   });
// });
