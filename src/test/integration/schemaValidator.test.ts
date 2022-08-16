import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
chai.use(chaiShallowDeepEqual);
import { validationErrors } from '../utilities/validators';

const expect = chai.expect;

describe('Validates Queries', () => {
  it('Validates a valid query', () => {
    const query = `query Address($name: String!) {
            address(name: $name) {
                longitude
                latitude
            }
          }`;
    const err = validationErrors(query);
    console.log('err:', err);
    expect(err).to.be.empty;
  });

  it('Validates a bad query', () => {
    const query = `query Address($name: String!) {
              address(name: $name) {
                  longit
                  latitude
              }
            }`;
    const err = validationErrors(query);
    console.log('err:', err.toString());
    expect(err.toString()).to.includes(
      'Cannot query field "longit" on type "Address". Did you mean "longitude"?'
    );
  });
});
