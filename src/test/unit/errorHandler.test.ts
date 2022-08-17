import { expect } from 'chai';
import { ERROR_MESSAGES } from '../../conf/constants';
import { handleAcceptedErrors } from '../../dataSources/calculateCoordinates';

// Error: Please provide valid address!
// "Failed to get coordinates: Error: Status is INVALID_REQUEST. Invalid request. Missing the 'address', 'components', 'latlng' or 'place_id' parameter."
// "err in express middleware: UnauthorizedError: No authorization token was found"

describe('handleAcceptedErrors tests', () => {
  it('should be able to handle REQUEST_DENIED error', () => {
    const err = handleAcceptedErrors(
      'OperationalError: Status is REQUEST_DENIED. The provided API key is invalid.'
    );
    expect(err).to.shallowDeepEqual(`Error: ${ERROR_MESSAGES.INVALID_API_KEY}`);
  });

  it('should be able to handle INCOMPLETE_ADDRESS error', () => {
    const err = handleAcceptedErrors(ERROR_MESSAGES.INCOMPLETE_ADDRESS);
    expect(err.toString()).to.equal(
      `Error: ${ERROR_MESSAGES.INCOMPLETE_ADDRESS}`
    );
  });

  it('should be able to handle INCOMPLETE_ADDRESS error', () => {
    const err = handleAcceptedErrors('Unauthorized Error');
    expect(err.cause).to.shallowDeepEqual({
      name: 'InternalServerError',
      message: 'Please check all required constraints are met!',
    });
  });
});
