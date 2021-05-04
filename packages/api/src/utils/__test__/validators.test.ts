import { validateDob } from '../validators';

describe('validateDob', () => {
  it('passes if dob is past date', () => {
    validateDob('2017-11-02T05:09:39.187Z');
    expect(true).toBeTruthy();
  });

  it('passes if dob is the future date', () => {
    try {
      validateDob('2023-11-02T05:09:39.187Z');
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
