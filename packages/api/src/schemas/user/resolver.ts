import { withFilter } from 'aws-lambda-graphql';
import {
  MutationCreateUserArgs,
  MutationDeleteUserArgs,
  MutationUpdateUserArgs,
  PaginatedUsers,
  QueryGetUserArgs,
  QueryListUsersArgs,
  SubscribeToUser,
  SubscriptionSubscribeToUserArgs,
  User,
} from '@sf/core/user';
import { pubSub } from '@sf/api/config';
import { userService } from '@sf/api/services';
import { PUBLISH_USER, PublishUserPayload } from '@sf/api/subscriptions';

const resolver = {
  Query: {
    async listUsers(_, args: QueryListUsersArgs): Promise<PaginatedUsers> {
      const { filter, pageInfo } = args;
      const { items, offset, total } = await userService.findAll(pageInfo, filter);
      return {
        offset,
        total,
        users: items,
      };
    },
    async getUser(_, args: QueryGetUserArgs): Promise<User> {
      const { id } = args;
      return userService.findOne(id);
    },
  },

  Mutation: {
    async createUser(_, args: MutationCreateUserArgs): Promise<User> {
      const { user } = args;
      return userService.create(user);
    },
    async updateUser(_, args: MutationUpdateUserArgs): Promise<User> {
      const { user } = args;
      return userService.update(user);
    },
    async deleteUser(_, args: MutationDeleteUserArgs): Promise<boolean> {
      const { id } = args;
      await userService.delete(id);
      return true;
    },
  },

  Subscription: {
    subscribeToUser: {
      resolve: (payload: PublishUserPayload): SubscribeToUser => {
        return payload;
      },
      subscribe: withFilter(
        pubSub.subscribe(PUBLISH_USER),
        (payload: PublishUserPayload, args: SubscriptionSubscribeToUserArgs) => {
          const { user } = payload;
          const { filter } = args;
          if (!filter) { return true; }
          return userService.userMatches(user, filter);
        },
      ),
    },
  },
};

export default resolver;
