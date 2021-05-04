import { paginateResponse } from '../pagination';

describe('paginateResponse', () => {
  const items: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('returns paginated response', () => {
    let response = paginateResponse(items, { offset: 0, limit: 5 });
    expect(response.items).toEqual([1, 2, 3, 4, 5]);
    expect(response.offset).toEqual(0);
    expect(response.total).toEqual(items.length);

    response = paginateResponse(items, { offset: 10, limit: 5 });
    expect(response.items).toEqual([]);
    expect(response.offset).toEqual(10);
    expect(response.total).toEqual(items.length);
  });

  it('throws error when offset is less than 0', () => {
    try {
      paginateResponse(items, { offset: -1, limit: 5 });
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('throws error when limit is less than or equal to 0', () => {
    try {
      paginateResponse(items, { offset: 0, limit: 0 });
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});