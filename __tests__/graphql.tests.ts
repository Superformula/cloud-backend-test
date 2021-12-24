const axios = require('axios');

const awsmobile = {
    "aws_project_region": "us-east-1",
    "aws_appsync_graphqlEndpoint": "",
    "aws_appsync_region": "us-east-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": ""
};

let createdUser = { id: null };

describe('Test Mutations', () => {
    test('Create user', async () => {
        return axios({
            url: awsmobile.aws_appsync_graphqlEndpoint,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": awsmobile.aws_appsync_apiKey
            },
            data: { query: `mutation createUser { createUser(input: {name: "Moises Da Silva", address: "Blumenau/SC"}){ id name address dob imageUrl createdAt updatedAt }}`}
        }).then( res =>  {         
            if(res.data && res.data.data && res.data.data.createUser)
                createdUser = res.data.data.createUser;
            
            expect(createdUser.id !== null).toBe(true);
        });
    });

    test('Get user', async () => {
        return axios({
            url: awsmobile.aws_appsync_graphqlEndpoint,
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": awsmobile.aws_appsync_apiKey
            },
            data: { query: `query getUser { getUser(id: "${createdUser.id}") { id name address dob imageUrl createdAt updatedAt } }`
          }
        }
    ).then( res =>  expect(res.data 
        && res.data.data 
        && res.data.data.getUser 
        && res.data.data.getUser.id === createdUser.id).toBe(true) );
    });
    
  });