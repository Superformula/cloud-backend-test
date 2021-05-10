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
      name: 'Mario Ruiz Diaz',
      description: 'new desc',
      id: 'fa8d7da0-af85-11eb-9859-577507baa6d7',
      imageUrl: 'test.com'
    }
  ],
  Count: 1,
  ScannedCount: 21
};

describe('Integration', () => {
  describe('Queries', () => {
    it('users - read one by Id - success', async () => {
      
      const {server, geoDataStorage, storeDataStorage} = constructTestServer();

      mockedContext.db.scan.mockReturnValueOnce({
        promise: () => Promise.resolve(mockedReadByIdDbResponse)
      });

      const { query } = createTestClient(server);
      const res = await query({query: GET_USER_BY_ID});
      expect(res).toMatchSnapshot();
    });

    
  });
});