import { GeoDataSource } from '../geo/GeoDataSource';
import { ModelEnum } from '../../../common/globalModel';
import { ApolloError } from 'apollo-server-lambda';


//#region Mocks

const mock = {
  geoClient: {
    forwardGeocode: jest.fn()
  }
};




const mockedGeocodeInputArgs = "Buenos Aires, Argentina";

const mockedGeocodeRESTapiResponse = {
    request: {
      id: 1,
      _options: {
        method: 'GET',
        path: '/geocoding/v5/:mode/:query.json',
      },
      emitter: {
        _events: {},
        _eventsCount: 0
      },
      client:{
        accessToken: 'pk.eyJ1IjoibWFyaW9ydWl6ZGlheiIsImEiOiJja29lcGgzZGswY2hjMnducTBycmF2Mnh4In0.5AiTnbVzqm0iA-1B8N0leA',
        origin: 'https://api.mapbox.com'
      },
      response: [],
      error: null,
      sent: true,
      aborted: false,
      path: '/geocoding/v5/:mode/:query.json',
      method: 'GET',
      origin: 'https://api.mapbox.com',
      query: { country: undefined, limit: 3, types: [Array] },
      params: { query: 'Buenos Aires, Argentina', mode: 'mapbox.places' },
      body: null,
      file: null,
      encoding: 'utf8',
      sendFileAs: null,
      headers: {}
    },
    headers: {
      'content-type': 'application/vnd.geo+json; charset=utf-8',
      'transfer-encoding': 'chunked',
      connection: 'close',
      date: 'Sun, 09 May 2021 00:37:24 GMT',
      'x-powered-by': 'Express',
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'x-rate-limit-interval,x-rate-limit-limit,x-rate-limit-remaining,x-rate-limit-reset',
      'cache-control': 'max-age=604800',
      'x-rate-limit-limit': '600',
      'x-rate-limit-interval': '60',
      'x-rate-limit-reset': '1620520704',
      'last-modified': 'Sat, 08 May 2021 21:50:33 GMT',
      etag: '"acb4d7797901dbc338cae465905b7d6f"',
      'content-encoding': 'gzip',
      vary: 'Accept-Encoding',
      'x-cache': 'Miss from cloudfront',
      via: '1.1 a8051f15f8fb632defb578cd89b94050.cloudfront.net (CloudFront)',
      'x-amz-cf-pop': 'EZE51-C1',
      'x-amz-cf-id': 'I4FoYtZJI7vHDDBfJJFp2JnQDVT-KNzW2yG0AlcvEqO5Pv522ZqtTw=='
    },
    rawBody: '{"type":"FeatureCollection","query":["buenos","aires","argentina"],"features":[{"id":"address.538903949","type":"Feature","place_type":["address"],"relevance":0.787037,"properties":{"accuracy":"street"},"text":"Rua Buenos Aires","place_name":"Rua Buenos Aires, Buenos Aires, Criciúma - Santa Catarina, Brazil","center":[-49.310869,-28.649003],"geometry":{"type":"Point","coordinates":[-49.310869,-28.649003]},"context":[{"id":"neighborhood.12060643771886620","text":"Buenos Aires"},{"id":"place.10400737738126720","wikidata":"Q1439157","text":"Criciúma"},{"id":"region.9987667069176350","wikidata":"Q41115","short_code":"BR-SC","text":"Santa Catarina"},{"id":"country.9531777110682710","wikidata":"Q155","short_code":"br","text":"Brazil"}]},{"id":"address.616317573","type":"Feature","place_type":["address"],"relevance":0.574074,"properties":{"accuracy":"street"},"text":"Rua Buenos Aires","place_name":"Rua Buenos Aires, Empresa, Taquara - Rio Grande do Sul, Brazil","center":[-50.776794,-29.675017],"geometry":{"type":"Point","coordinates":[-50.776794,-29.675017]},"context":[{"id":"neighborhood.12345200203512780","text":"Empresa"},{"id":"place.14142246228599070","wikidata":"Q967715","text":"Taquara"},{"id":"region.7885823374337590","wikidata":"Q40030","short_code":"BR-RS","text":"Rio Grande do Sul"},{"id":"country.9531777110682710","wikidata":"Q155","short_code":"br","text":"Brazil"}]},{"id":"address.161870853","type":"Feature","place_type":["address"],"relevance":0.574074,"properties":{"accuracy":"street"},"text":"Rua Buenos Aires","place_name":"Rua Buenos Aires Sapiranga - Rio Grande do Sul, Brazil","center":[-50.996556,-29.647132],"geometry":{"type":"Point","coordinates":[-50.996556,-29.647132]},"context":[{"id":"place.15632666223415620","wikidata":"Q983717","text":"Sapiranga"},{"id":"region.7885823374337590","wikidata":"Q40030","short_code":"BR-RS","text":"Rio Grande do Sul"},{"id":"country.9531777110682710","wikidata":"Q155","short_code":"br","text":"Brazil"}]}],"attribution":"NOTICE: © 2021 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare."}',
    statusCode: 200,
    body: {
      type: 'FeatureCollection',
      query: [ 'buenos', 'aires', 'argentina' ],
      features: [ {
        id: 'address.538903949',
        type: 'Feature',
        place_type: [ 'address' ],
        relevance: 0.787037,
        properties: { accuracy: 'street' },
        text: 'Rua Buenos Aires',
        place_name: 'Rua Buenos Aires, Buenos Aires, Criciúma - Santa Catarina, Brazil',
        center: [ -49.310869, -28.649003 ],
        geometry: { type: 'Point', coordinates: [Array] },
        context: [ [Object], [Object], [Object], [Object] ]
      },
      {
        id: 'address.616317573',
        type: 'Feature',
        place_type: [ 'address' ],
        relevance: 0.574074,
        properties: { accuracy: 'street' },
        text: 'Rua Buenos Aires',
        place_name: 'Rua Buenos Aires, Empresa, Taquara - Rio Grande do Sul, Brazil',
        center: [ -50.776794, -29.675017 ],
        geometry: { type: 'Point', coordinates: [Array] },
        context: [ [Object], [Object], [Object], [Object] ]
      },
      {
        id: 'address.161870853',
        type: 'Feature',
        place_type: [ 'address' ],
        relevance: 0.574074,
        properties: { accuracy: 'street' },
        text: 'Rua Buenos Aires',
        place_name: 'Rua Buenos Aires Sapiranga - Rio Grande do Sul, Brazil',
        center: [ -50.996556, -29.647132 ],
        geometry: { type: 'Point', coordinates: [Array] },
        context: [ [Object], [Object], [Object] ]
      } ],
      attribution: 'NOTICE: © 2021 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare.'
    },
    links: {}
};

const mockedGeocodeResponse = [
  {
    place: 'Rua Buenos Aires, Buenos Aires, Criciúma - Santa Catarina, Brazil',
    latitude: -49.310869,
    longitude: -28.649003
  },
  {
    place: 'Rua Buenos Aires, Empresa, Taquara - Rio Grande do Sul, Brazil',
    latitude: -50.776794,
    longitude: -29.675017
  },
  {
    place: 'Rua Buenos Aires Sapiranga - Rio Grande do Sul, Brazil',
    latitude: -50.996556,
    longitude: -29.647132
  }
];


//#endregion Mocks

//#region Initializations

const dataStorage = new GeoDataSource(mock.geoClient);


//#endregion Initializations

describe('[DataSource - GeoLlocalization]', () => {

  describe('geocode service', () => {
    it('success', async () => {
      mock.geoClient.forwardGeocode.mockReturnValueOnce({
        send: () => Promise.resolve(mockedGeocodeRESTapiResponse)
      });

      await expect(dataStorage.geocode(mockedGeocodeInputArgs)).resolves.toEqual(mockedGeocodeResponse);
    });

    it('read one by Id - failure', async () => {
      mock.geoClient.forwardGeocode.mockReturnValueOnce({
        send: () => Promise.reject(new Error("Service down"))
      });

      await expect(dataStorage.geocode(mockedGeocodeInputArgs)).rejects.toEqual(new ApolloError("Service down"));
    });

    
  });
  
  
});

