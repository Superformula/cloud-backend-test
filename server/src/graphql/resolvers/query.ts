import { AppContext } from '../../types/types';
import { QueryResolvers } from '../types/types';

export const Query: QueryResolvers<AppContext> = {
  user: async (_parent, args, context) => {
    const user = await context.userService.getUser(args.id);
    return user;
  },
  users: async (_parent, args, context) => {
    const users = await context.userService.getAll(args.query);
    return users;
  },
};
