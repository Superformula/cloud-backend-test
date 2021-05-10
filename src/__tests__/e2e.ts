// import our production apollo-server instance
import gql from 'graphql-tag';
import { launchLambdaLocally, teardown, executeOperastion } from './__utils';
import { v4 } from 'uuid';
import '@testing-library/jest-dom/extend-expect';


const getUserByNameQuery = (name: string) => `
query readUser {
  users(
     name: "${name}"
  ){
    items{
      description
    }
  }
}
`;

const readByNameResponse = {
    "users": {
      "items": [
        {
          "description": "test"
        }
      ]
    }
};

const createUserQuery = (name: string) => `mutation createUser {
  createUser(
    attributes: {
      name: "${name}",
      description: "test",
      dob: "test",
      address: {
        place: "Buenos Aires",
        latitude: 121212,
        longitude: 353434653
      },
      imageUrl: "test.com"
    }
  ){
    imageUrl
  }
}`;



const createUserResponse = { createUser: { imageUrl: 'test.com' } };

describe('Server - e2e', () => {
  

  const randomName = v4();

  beforeAll(async () => {
    const started = await launchLambdaLocally();
    expect(started).toEqual(true);
  }, 60000); // extending the default time out to let the lambda start running locally

  afterAll(async () => {
    const isDown = await teardown();
    expect(isDown).toEqual(true);
  });

  describe('Create one and read after', () => {
    it('users - create - success case', async () => {
      const result = await executeOperastion(createUserQuery( randomName ));
      expect(result).toMatchObject(createUserResponse);
  
      expect(true).toEqual(true);
    });
  
    it('users - read by name - success case', async () => {
      const result = await executeOperastion(getUserByNameQuery( randomName ));
      expect(result).toMatchObject(readByNameResponse);
  
      expect(true).toEqual(true);
    });

  });

  

  
});
