import * as Config from '@sf/api/config';
import { User } from '@sf/core/user';
import * as Subscriptions from '@sf/api/subscriptions';
import { userService } from '../user';

jest.mock('aws-sdk');
jest.mock('@sf/api/config');
jest.mock('@sf/api/subscriptions');

const user: User = {
  id: '7dccdfde-ba9b-4ee5-92c7-c186c21c8543',
  address: 'Zboncak Cliff, East Ritamouth, 73326',
  description: 'Description 1',
  name: 'Elliot Breitenberg',
  dob: '2017-11-02T05:09:39.187Z',
  imageUrl: 'https://i.pravatar.cc/150?u=Elliot+Breitenberg',
  createdAt: '2020-03-22T16:12:01.496Z',
  updatedAt: '2020-07-04T04:42:43.636Z'
};

const user1: User = {
  id: '102222fe-9e75-4e50-a229-a4dfc6831275',
  address: 'Davis Square, Philipborough, 23884-5521',
  description: 'Description 2',
  name: 'Sanford Johnston',
  dob: '2019-03-16T01:17:23.004Z',
  imageUrl: 'https://i.pravatar.cc/150?u=Sanford+Johnston',
  createdAt: '2019-07-05T21:17:43.124Z',
  updatedAt: '2020-06-28T08:08:39.771Z',
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('userMatches', () => {
  it('returns true if no filter is provided', () => {
    expect(userService.userMatches(user)).toBeTruthy();
  });

  it('returns true if empty string is provided', () => {
    expect(userService.userMatches(user, { name: '' })).toBeTruthy();
  });

  it('returns true if name matches filter', () => {
    expect(userService.userMatches(user, { name: 'Elliot' })).toBeTruthy();
    expect(userService.userMatches(user, { name: 'Breitenberg' })).toBeTruthy();
    expect(userService.userMatches(user, { name: 'Breit' })).toBeTruthy();
    expect(userService.userMatches(user, { name: 'Elliot Breitenberg' })).toBeTruthy();
  });

  it('returns false if name doesn\'t match', () => {
    expect(userService.userMatches(user, { name: 'CRAZY' })).toBeFalsy();
  });
});

describe('findAll', () => {
  beforeEach(() => {
    jest.spyOn(Config.dynamoDbClient, 'scan').mockReturnValue({
      promise: jest.fn().mockResolvedValue({
        Items: [user, user1],
      })
    } as any);
  });

  it('returns paginated users', async () => {
    const data = await userService.findAll({ offset: 0, limit: 10 });
    expect(Config.dynamoDbClient.scan).toBeCalledWith({ TableName: 'Users' });
    expect(data.items).toEqual([user, user1]);
    expect(data.offset).toEqual(0);
    expect(data.total).toEqual(2);
  });

  it('returns filtered paginated users', async () => {
    const data = await userService.findAll(
      { offset: 0, limit: 10 },
      { name: 'Elliot' }
    );
    expect(Config.dynamoDbClient.scan).toBeCalledWith({ TableName: 'Users' });
    expect(data.items).toEqual([user]);
    expect(data.offset).toEqual(0);
    expect(data.total).toEqual(1);
  });
});

describe('findOne', () => {
  beforeEach(() => {
    jest.spyOn(Config.dynamoDbClient, 'get').mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: user })
    } as any);
  });

  it('return user', async () => {
    const data = await userService.findOne(user.id);
    expect(Config.dynamoDbClient.get).toBeCalledWith({
      TableName: 'Users', 
      Key: { id: user.id },
    });
    expect(data).toEqual(user);
  });
});

describe('create', () => {
  beforeEach(() => {
    jest.spyOn(Config.dynamoDbClient, 'put').mockReturnValue({ promise: jest.fn() } as any);
    jest.spyOn(Config.dynamoDbClient, 'get').mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: { ...user } })
    } as any);
    jest.spyOn(Subscriptions, 'publishUser');
  });

  it('creates a new user', async () => {
    const data = await userService.create({
      name: 'New Name',
      dob: '2017-11-02T05:09:39.187Z',
      address: 'New Address',
      description: 'New user description',
    });
    expect(Config.dynamoDbClient.put).toBeCalledWith({
      TableName: 'Users', 
      Item: {
        id: expect.any(String),
        name: 'New Name',
        dob: '2017-11-02T05:09:39.187Z',
        address: 'New Address',
        description: 'New user description',
        imageUrl: 'https://i.pravatar.cc/150?u=New%20Name',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
    expect(Config.dynamoDbClient.get).toBeCalledWith({
      TableName: 'Users', 
      Key: { id: expect.any(String) },
    });
    expect(Subscriptions.publishUser).toBeCalledWith(user, 'created');
    expect(data).toEqual(user);
  });

  it('throws error when dob is invalid', async () => {
    try {
      await userService.create({
        name: 'New Name',
        dob: '2023-01-01T00:00:00.000Z',
        address: 'New Address',
        description: 'New user description',
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
    expect(Subscriptions.publishUser).not.toBeCalled();
    expect(Config.dynamoDbClient.put).not.toBeCalled();
    expect(Config.dynamoDbClient.get).not.toBeCalled();
  });
});

describe('update', () => {
  beforeEach(() => {
    jest.spyOn(Config.dynamoDbClient, 'put').mockReturnValue({ promise: jest.fn() } as any);
    jest.spyOn(Config.dynamoDbClient, 'get').mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: { ...user } })
    } as any);
    jest.spyOn(Subscriptions, 'publishUser');
  });

  it('updates existing user', async () => {
    const data = await userService.update({
      id: user.id,
      name: 'New Name',
      dob: '2017-11-02T05:09:39.187Z',
      address: 'New Address',
      description: 'New user description',
    });
    expect(Config.dynamoDbClient.get).toBeCalledWith({
      TableName: 'Users', 
      Key: { id: user.id },
    });
    const updatedUser = {
      id: user.id,
      name: 'New Name',
      dob: '2017-11-02T05:09:39.187Z',
      address: 'New Address',
      description: 'New user description',
      imageUrl: 'https://i.pravatar.cc/150?u=New%20Name',
      createdAt: user.createdAt,
      updatedAt: expect.any(String),
    };
    expect(Config.dynamoDbClient.put).toBeCalledWith({
      TableName: 'Users', 
      Item: updatedUser,
    });
    expect(Subscriptions.publishUser).toBeCalledWith(updatedUser, 'updated');
    expect(data).toEqual(updatedUser);
  });

  it('throws error when dob is invalid', async () => {
    try {
      await userService.update({
        id: user.id,
        name: 'New Name',
        dob: '2023-01-01T00:00:00.000Z',
        address: 'New Address',
        description: 'New user description',
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
    expect(Subscriptions.publishUser).not.toBeCalled();
    expect(Config.dynamoDbClient.get).not.toBeCalled();
    expect(Config.dynamoDbClient.put).not.toBeCalled();
  });
});

describe('delete', () => {
  beforeEach(() => {
    jest.spyOn(Config.dynamoDbClient, 'delete').mockReturnValue({ promise: jest.fn() } as any);
    jest.spyOn(Config.dynamoDbClient, 'get').mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Item: { ...user } })
    } as any);
    jest.spyOn(Subscriptions, 'publishUser');
  });

  it('deletes existing user', async () => {
    await userService.delete(user.id);
    expect(Config.dynamoDbClient.get).toBeCalledWith({
      TableName: 'Users', 
      Key: { id: user.id },
    });
    expect(Config.dynamoDbClient.delete).toBeCalledWith({
      TableName: 'Users', 
      Key: { id: user.id },
    });
    expect(Subscriptions.publishUser).toBeCalledWith(user, 'deleted');
  });

  it('throws error when user does not exist', async () => {
    jest.spyOn(Config.dynamoDbClient, 'get').mockReturnValue({
      promise: jest.fn().mockRejectedValue({})
    } as any);
    try {
      await userService.delete(user.id);
      expect(true).toBe(false);
    } catch (err) {
      expect(err).toBeDefined();
    }
    expect(Config.dynamoDbClient.get).toBeCalledWith({
      TableName: 'Users', 
      Key: { id: user.id },
    });
    expect(Subscriptions.publishUser).not.toBeCalled();
    expect(Config.dynamoDbClient.put).not.toBeCalled();
  });
});
