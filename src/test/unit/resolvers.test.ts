import { resolvers } from '../../resolvers/coordinates';
import DATA from '../utilities/testData';
import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { ERROR_MESSAGES } from '../../conf/constants';
import { dataSources } from '../..';
chai.use(chaiShallowDeepEqual);
const expect = chai.expect;

describe('Resolver tests', () => {
  it('should be able to return results', async () => {
    const data = {
      dataSources: dataSources(),
    };
    const res = await resolvers.Query.address(
      null,
      { name: DATA.ADDRESS },
      data
    );
    expect(res.address).to.shallowDeepEqual({
      formattedAddress: '29 Main St, Watertown, MA 02472, USA',
      latitude: 42.366192,
      longitude: -71.18494799999999,
      extra: {
        googlePlaceId: 'ChIJWd79twV444kRFUhIPW9_9FA',
        confidence: 1,
        premise: null,
        subpremise: null,
        neighborhood: 'Watertown',
        establishment: null,
      },
      administrativeLevels: {
        level2long: 'Middlesex County',
        level2short: 'Middlesex County',
        level1long: 'Massachusetts',
        level1short: 'MA',
      },
      streetNumber: '29',
      streetName: 'Main Street',
      city: 'Watertown',
      country: 'United States',
      countryCode: 'US',
      zipcode: '02472',
      provider: 'google',
    });
  });

  it('should be able to return longitude', () => {
    const res = resolvers.Address.longitude({ address: DATA.ENTRY });
    expect(res).to.equal(DATA.ENTRY.longitude);
  });

  it('should be able to return latitude', () => {
    const res = resolvers.Address.latitude({ address: DATA.ENTRY });
    expect(res).to.equal(DATA.ENTRY.latitude);
  });

  it('should be able to throw error for partial address', () => {
    const res = resolvers.Address.longitude({
      address: { formattedAddress: DATA.ENTRY.formattedAddress },
    });
    expect(res).to.equal(undefined);
  });

  it('should be able to throw error for partial address', () => {
    try {
      resolvers.Address.latitude({
        address: { formattedAddress: DATA.ENTRY.formattedAddress },
      });
    } catch (err) {
      expect(err).to.shallowDeepEqual(
        `Error: ${ERROR_MESSAGES.INCOMPLETE_ADDRESS}`
      );
    }
  });

  it('should be able to throw error for bad address', () => {
    try {
      resolvers.Address.latitude({
        address: { formattedAddress: DATA.BAD_ADDRESS },
      });
    } catch (err) {
      expect(err).to.shallowDeepEqual(
        `Error: ${ERROR_MESSAGES.INVALID_ADDRESS}`
      );
    }
  });

  it('should be able to throw error for bad address', () => {
    try {
      resolvers.Address.longitude({
        address: { formattedAddress: DATA.BAD_ADDRESS },
      });
    } catch (err) {
      expect(err).to.shallowDeepEqual(
        `Error: ${ERROR_MESSAGES.INVALID_ADDRESS}`
      );
    }
  });
});
