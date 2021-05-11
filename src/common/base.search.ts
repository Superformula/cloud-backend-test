import { ISearchInput } from "./interfaces/search.interface"

const getQuery = (searchCriteria?: ISearchInput) => {
  const query: any = {}
  const limit = searchCriteria?.limit ?? 10
  const skip = searchCriteria?.skip ?? 0

  query.limit = limit
  query.offset = (limit*skip)

  return query
}

export { getQuery }