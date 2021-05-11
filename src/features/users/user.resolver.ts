import { UserService } from './user.service'
import { S3Provider } from '@/providers/s3.provider'

const s3Provider = new S3Provider()
const userService = new UserService(s3Provider)

const resolvers = {
  Query: {
    users: async (_, { searchCriteria }) => {
      return userService.findAll(searchCriteria)
    },
    user: async (_, { id }) => {
      return userService.find(id)
    }
  },
  Mutation: {
    createUser: async (_, { data }) => {
      return userService.create(data)
    },
    updateUser: async (_, { data }) => {
      return userService.update(data)
    },
    deleteUser: async (_, { id }) => {
      await userService.delete(id)
      return true
    }
  }
}

export { resolvers }
