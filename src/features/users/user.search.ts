import { getQuery } from "@/common/base.search";
import { BaseQuery, IDbSearch, ISearchInput } from "@/common/interfaces/search.interface";
import { Op } from "sequelize";

export class UserSearch implements IDbSearch {
  searchCriteria?: UserSearchInput

  constructor(searchCriteria: UserSearchInput | undefined) {
    this.searchCriteria = searchCriteria
  }

  query(): BaseQuery {
    const query = new BaseQuery()
    const { limit, offset } = getQuery(this.searchCriteria)

    query.limit = limit
    query.offset = offset
    query.where = {}

    if (this.searchCriteria?.name) {
      query.where.name = { [Op.like]: `%${this.searchCriteria.name}%` }
    }

    return query
  }
}

export interface UserSearchInput extends ISearchInput {
  name?: string
}