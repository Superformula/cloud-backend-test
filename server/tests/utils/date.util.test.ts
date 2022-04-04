import { dateIsValid, formatDateOnly, getCurrentDateStr } from '../../src/utils/date.util';

/* eslint-disable no-undef */
describe('DateIsValid function', () => {
  it('should return false if date string is invalid', () => {
    const str = 'Invalid date';
    expect(dateIsValid(str)).toBeFalsy();
  });

  it('should return true if date string is valid', () => {
    const str = '2022/04/03';
    expect(dateIsValid(str)).toBeTruthy();
  });
});

describe('FormatDateOnly function', () => {
  it('should return date str on ISO format', () => {
    const str = '2022/04/03';
    expect(formatDateOnly(str)).toBeTruthy();
  });
});

describe('GetCurrentDateStr function', () => {
  it('should return current date in str', () => {
    expect(getCurrentDateStr()).toBeTruthy();
  });
});
