export class BaseQuery {
  limit: number
  offset: number
  where: any
}

export interface IDbSearch {
  query(query: BaseQuery): BaseQuery
}

export interface ISearchInput {
  limit?: number | undefined | null
  skip?: number | undefined | null
}