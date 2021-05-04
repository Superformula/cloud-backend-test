import * as Services from '@sf/api/services';
import {
  MutationCreateUserArgs,
  MutationDeleteUserArgs,
  MutationUpdateUserArgs,
  QueryGetUserArgs,
  QueryListUsersArgs,
  User
} from '@sf/core/user';
import resolver from '../resolver';

jest.mock('@sf/api/services');

const user1: User = {
  id: '7dccdfde-ba9b-4ee5-92c7-c186c21c8543',
  address: 'Zboncak Cliff, East Ritamouth, 73326',
  description: 'Description 1',
  name: 'Elliot Breitenberg',
  dob: '2017-11-02T05:09:39.187Z',
  imageUrl: 'https://i.pravatar.cc/150?u=Elliot+Breitenberg',
  createdAt: '2020-03-22T16:12:01.496Z',
  updatedAt: '2020-07-04T04:42:43.636Z',
};

const user2: User = {
  id: '102222fe-9e75-4e50-a229-a4dfc6831275',
  address: 'Davis Square, Philipborough, 23884-5521',
  description: 'Description 2',
  name: 'Sanford Johnston',
  dob: '2019-03-16T01:17:23.004Z',
  imageUrl: 'https://i.pravatar.cc/150?u=Sanford+Johnston',
  createdAt: '2019-07-05T21:17:43.124Z',
  updatedAt: '2020-06-28T08:08:39.771Z',
};

describe('Query listUsers', () => {
  let args: QueryListUsersArgs;

  beforeEach(() => {
    args = { pageInfo: { limit: 2, offset: 0 } };
    jest.spyOn(Services.userService, 'findAll').mockResolvedValue({
      items: [user1, user2],
      offset: 0,
      total: 50,
    });
  });

  it('returns users list from the service', async () => {
    const { listUsers } = resolver.Query;
    const response = await listUsers({}, args);
    expect(Services.userService.findAll).toBeCalledWith(args.pageInfo, args.filter);
    expect(response).toEqual({
      users: [user1, user2],
      offset: 0,
      total: 50,
    });
  });

  it('returns users list from the service with filter', async () => {
    const { listUsers } = resolver.Query;
    args.filter = { name: 'filter' };
    const response = await listUsers({}, args);
    expect(Services.userService.findAll).toBeCalledWith(args.pageInfo, args.filter);
    expect(response).toEqual({
      users: [user1, user2],
      offset: 0,
      total: 50,
    });
  });

  it('throws error when service function fails', async () => {
    jest.spyOn(Services.userService, 'findAll').mockRejectedValue({});
    const { listUsers } = resolver.Query;
    try {
      await listUsers({}, args);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(Services.userService.findAll).toBeCalledWith(args.pageInfo, args.filter);
  });
});

describe('Query getUser', () => {
  let args: QueryGetUserArgs;

  beforeEach(() => {
    args = { id: user1.id };
    jest.spyOn(Services.userService, 'findOne').mockResolvedValue(user1);
  });

  it('returns one user from the service', async () => {
    const { getUser } = resolver.Query;
    const response = await getUser({}, args);
    expect(Services.userService.findOne).toBeCalledWith(args.id);
    expect(response).toEqual(user1);
  });

  it('throws error when service function fails', async () => {
    jest.spyOn(Services.userService, 'findOne').mockRejectedValue({});
    const { getUser } = resolver.Query;
    try {
      await getUser({}, args);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(Services.userService.findOne).toBeCalledWith(args.id);
  });
});

describe('Mutation createUser', () => {
  let args: MutationCreateUserArgs;
  const defaultUserAttrs: Pick<User, 'id' | 'imageUrl' | 'createdAt' | 'updatedAt'> = {
    id: 'new-user-1',
    imageUrl: 'image-url',
    createdAt: '2019-07-05T21:17:43.124Z',
    updatedAt: '2020-06-28T08:08:39.771Z',
  };

  beforeEach(() => {
    args = {
      user: {
        name: 'New Name',
        dob: '2017-11-02T05:09:39.187Z',
        address: 'New Address',
        description: 'New user description',
      },
    };
    jest.spyOn(Services.userService, 'create').mockImplementation(async (input) => ({
      ...input,
      ...defaultUserAttrs,
    }));
  });

  it('returns one user from the service', async () => {
    const { createUser } = resolver.Mutation;
    const response = await createUser({}, args);
    expect(Services.userService.create).toBeCalledWith(args.user);
    expect(response).toEqual({ ...args.user, ...defaultUserAttrs });
  });

  it('throws error when service function fails', async () => {
    jest.spyOn(Services.userService, 'create').mockRejectedValue({});
    const { createUser } = resolver.Mutation;
    try {
      await createUser({}, args);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(Services.userService.create).toBeCalledWith(args.user);
  });
});

describe('Mutation updateUser', () => {
  let args: MutationUpdateUserArgs;

  beforeEach(() => {
    args = {
      user: {
        id: user1.id,
        name: 'New Name',
        dob: '2017-11-02T05:09:39.187Z',
        address: 'New Address',
        description: 'New user description',
      },
    };
    jest.spyOn(Services.userService, 'update').mockImplementation(async (input) => ({
      ...user1,
      ...input,
    }));
  });

  it('returns updated user from the service', async () => {
    const { updateUser } = resolver.Mutation;
    const response = await updateUser({}, args);
    expect(Services.userService.update).toBeCalledWith(args.user);
    expect(response).toEqual({ ...user1, ...args.user });
  });

  it('throws error when service function fails', async () => {
    jest.spyOn(Services.userService, 'update').mockRejectedValue({});
    const { updateUser } = resolver.Mutation;
    try {
      await updateUser({}, args);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(Services.userService.update).toBeCalledWith(args.user);
  });
});

describe('Mutation deleteUser', () => {
  let args: MutationDeleteUserArgs;

  beforeEach(() => {
    args = { id: user1.id };
    jest.spyOn(Services.userService, 'delete');
  });

  it('deletes the user and returns true', async () => {
    const { deleteUser } = resolver.Mutation;
    const response = await deleteUser({}, args);
    expect(Services.userService.delete).toBeCalledWith(args.id);
    expect(response).toBeTruthy();
  });

  it('throws error when service function fails', async () => {
    jest.spyOn(Services.userService, 'delete').mockRejectedValue({});
    const { deleteUser } = resolver.Mutation;
    try {
      await deleteUser({}, args);
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toBeDefined();
    }
    expect(Services.userService.delete).toBeCalledWith(args.id);
  });
});
