import { Logger } from '@aws-lambda-powertools/logger';
import { Client, GeocodeResponseData, GeocodeResponse, Status, GeocodeResult, AddressGeometry } from '@googlemaps/google-maps-services-js';
import {LocationService} from '../../../../src/services/locationService';


describe('LocationService Unit Test', () => {
    describe('getCoordinates', () => {
      var logger = new Logger();
      test('Should return coordinates for valid address', async () => {
        
        var client = new Client();
        var response =  <GeocodeResponse>{};
        var geocodeResult = <GeocodeResult>{};
        geocodeResult.geometry = <AddressGeometry>{location:{lat: 1, lng: 1}};
        response.status = 200;
        response.data = <GeocodeResponseData>{results:[geocodeResult], status: Status.OK};
        
        jest.spyOn(client, 'geocode').mockResolvedValue(response);
        
        const locationService = new LocationService(client, logger);
        const result = await locationService.getCoordinates("validAddress");
        
        expect(result).toStrictEqual({latitude: 1, longitude: 1});
      });

      test('Should return error on response status other than 200', async () => {
        var client = new Client();
        var response =  <GeocodeResponse>{};
        response.status = 500;
        
        jest.spyOn(client, 'geocode').mockResolvedValue(response);
        
        const locationService = new LocationService(client, logger);
        const result = await locationService.getCoordinates("invalidAddress");
        
        expect(result?.code).toStrictEqual("LOCATION_NOT_FOUND");
      });
      test('Should return error on response data status other than OK', async () => {
        var client = new Client();
        var response =  <GeocodeResponse>{};
        response.status = 200;
        response.data = <GeocodeResponseData>{status: Status.NOT_FOUND};
        
        jest.spyOn(client, 'geocode').mockResolvedValue(response);
        
        const locationService = new LocationService(client, logger);
        const result = await locationService.getCoordinates("invalidAddress");
        
        expect(result?.code).toStrictEqual("LOCATION_NOT_FOUND");
      });
      test('Should return error on empty location result', async () => {
        var client = new Client();
        var response =  <GeocodeResponse>{};
        response.status = 200;
        response.data = <GeocodeResponseData>{status: Status.OK};
        
        
        jest.spyOn(client, 'geocode').mockResolvedValue(response);
        
        const locationService = new LocationService(client, logger);
        const result = await locationService.getCoordinates("invalidAddress");
        
        expect(result?.code).toStrictEqual("LOCATION_NOT_FOUND");
      });
    })
  })