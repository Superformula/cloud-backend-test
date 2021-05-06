import { user as userQueries } from "./Query/user"
import { user as userMutations } from "./Mutation/user"

export default {
    Query: {
        ...userQueries
    },
    Mutation: {
      ...userMutations,
    },
  }