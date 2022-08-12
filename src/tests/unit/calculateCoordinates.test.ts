import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { getCoordinates } from '../../calculateCoordinates';
import conf from '../../conf';
import { ERROR_MESSAGES } from '../../conf/constants';
import DATA from '../utilities/testData';
chai.use(chaiShallowDeepEqual);

const expect = chai.expect;

describe('Unit tests for getCoordinates', () => {
  it('should be able to create cooridantes', async () => {
    try {
      const address = await getCoordinates(
        '79 Saco street Newton MA',
        conf.apiKey
      );
      expect(address[0]).to.shallowDeepEqual({
        formattedAddress: '79 Saco St, Newton, MA 02464, USA',
        latitude: 42.3074919,
        longitude: -71.22178149999999,
        extra: {
          googlePlaceId: 'ChIJPRA7NCGC44kRWXs31NcYhF8',
          confidence: 1,
          premise: null,
          subpremise: null,
          neighborhood: 'Newton',
          establishment: null,
        },
        administrativeLevels: {
          level2long: 'Middlesex County',
          level2short: 'Middlesex County',
          level1long: 'Massachusetts',
          level1short: 'MA',
        },
        streetNumber: '79',
        streetName: 'Saco Street',
        city: 'Newton',
        country: 'United States',
        countryCode: 'US',
        zipcode: '02464',
        provider: 'google',
      });
    } catch (err) {
      expect(err).to.not.exist;
    }
  });

  it('should be able to create cooridantes for UK address', async () => {
    try {
      const address = await getCoordinates(DATA.UK_ADDRESS, conf.apiKey);
      expect(address[0]).to.shallowDeepEqual({
        formattedAddress: 'Eastleigh SO53, UK',
        latitude: 50.9885041,
        longitude: -1.3839546,
        extra: {
          googlePlaceId: 'ChIJtXfZpBBzdEgR7Zv0Y4LRQSk',
          confidence: 0.5,
          premise: null,
          subpremise: null,
          neighborhood: 'Hampshire',
          establishment: null,
        },
        administrativeLevels: {
          level2long: 'Hampshire',
          level2short: 'Hampshire',
          level1long: 'England',
          level1short: 'England',
        },
        zipcode: 'SO53',
        city: 'Eastleigh',
        country: 'United Kingdom',
        countryCode: 'GB',
        provider: 'google',
      });
    } catch (err) {
      expect(err).to.not.exist;
    }
  });

  it('should be able to handle error when api key is wrong', async () => {
    try {
      await getCoordinates(DATA.UK_ADDRESS, DATA.INVALID_API_KEY);
    } catch (err) {
      expect(err).to.exist;
      expect(err).to.shallowDeepEqual(
        `Error: ${ERROR_MESSAGES.INVALID_API_KEY}`
      );
    }
  });
});

