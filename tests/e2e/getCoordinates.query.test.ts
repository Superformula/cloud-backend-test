import { server } from './e2eConfig';

describe('getCoordinates Query e2e tests', () => {
    describe('getCoordinatesQuery', () => {
      test('Should return coordinates for valid address', async () => {
        
        const query = `
        query {
  
            getCoordinates(address: "New York") {
              ... on Coordinates{
                latitude
                longitude
              }
              ... on Error{
                code
                message
              },
            }
              
          }
        `

        const response = await server.executeOperation({query});
        
        expect(response.data?.getCoordinates?.latitude).toStrictEqual(40.7127753);
        expect(response.data?.getCoordinates?.longitude).toStrictEqual(-74.0059728);
      });
      test('Should return error invalid address', async () => {
        
        const query = `
        query {
  
            getCoordinates(address: "invalidAddress") {
              ... on Coordinates{
                latitude
                longitude
              }
              ... on Error{
                code
                message
              },
            }
              
          }
        `

        const response = await server.executeOperation({query});
        
        expect(response.data?.getCoordinates?.code).toStrictEqual("LOCATION_NOT_FOUND");
        
      });
      
    })
  })