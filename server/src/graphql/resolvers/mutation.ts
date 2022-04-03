import { AppContext } from '../../types/types';
import { MutationResolvers } from '../types/types';

export const Mutation: MutationResolvers<AppContext> = {
  createUser: async (_parent, args, context) => {
    const user = await context.userService.createUser(args.data);
    return user;
  },
  updateUser: async (_parent, args, context) => {
    const user = await context.userService.updateUser(args.id, args.data);
    return user;
  },
  deleteUser: async (_parent, args, context) => {
    const res = await context.userService.deleteUser(args.id);
    return res;
  },
};
