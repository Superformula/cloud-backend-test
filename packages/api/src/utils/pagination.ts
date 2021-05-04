export type PageInfo = {
  offset: number;
  limit: number;
}

export type PaginatedResponse<T> = {
  items: T[];
  offset: number;
  total: number;
}

export const paginateResponse = <T>(
  items: T[],
  pageInfo: PageInfo
): PaginatedResponse<T> => {
  const { offset, limit } = pageInfo;
  if (offset < 0) {
    throw new Error('offset should be greater than or equal to 0.');
  }
  if (limit <= 0) {
    throw new Error('limit should be greater than 0.');
  }

  const total = items.length;
  if (offset >= total) {
    return {
      items: [],
      offset,
      total,
    };
  }

  return {
    items: items.slice(offset, offset + limit),
    offset,
    total
  };
};
