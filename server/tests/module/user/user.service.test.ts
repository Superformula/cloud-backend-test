/* eslint-disable no-undef */
import AWSMock from 'aws-sdk-mock';
import aws from 'aws-sdk';
import { GetItemInput } from 'aws-sdk/clients/dynamodb';
import { UserService } from '../../../src/modules/user/user.service';
import { User } from '../../../src/graphql/types/types';
import * as utils from '../../../src/utils/date.util';

jest.mock('uuid', () => ({ v4: () => '1234' }));
jest.spyOn(utils, 'getCurrentDateStr').mockReturnValue('2022-04-03T00:05:42.004Z');

beforeAll(() => {
  AWSMock.setSDKInstance(aws);
});

afterEach(() => {
  AWSMock.restore('DynamoDB.DocumentClient');
});

// Tests for get user by id service
describe('Get user by Id service', () => {
  it('should fetch a user correctly', async () => {
    const mockResult: User = {
      id: '123',
      name: 'Jennifer',
      dob: '1998-12-10',
      imageUrl: '',
      address: '',
      description: 'Random descriptionß',
      createdAt: '2022-04-03T00:05:42.004Z',
      updatedAt: '2022-04-03T02:05:16.958Z',
    };

    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      callback(null, { Item: mockResult });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getUser('123');

    expect(res).toStrictEqual(mockResult);
  });

  it('should return error if user not found', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      callback(null, null);
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    await expect(userService.getUser('123')).rejects.toThrow('The user does not exist');
  });

  it('should return error database throws error', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'get', (params: GetItemInput, callback: Function) => {
      callback({ message: 'Database error' }, null);
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    await expect(userService.getUser('123')).rejects.toThrow('Error while getting user.');
  });
});

// Tests for get all users service
describe('Get all users service', () => {
  const userList: User[] = [
    {
      id: '1',
      name: 'Jennifer',
      dob: '1998-12-10',
      imageUrl: '',
      address: '',
      description: 'Random description',
      createdAt: '2022-04-03T00:05:42.004Z',
      updatedAt: '2022-04-03T02:05:16.958Z',
    },
    {
      id: '2',
      name: 'Rodrigo',
      dob: '1999-07-18',
      imageUrl: '',
      address: '',
      description: 'Random description',
      createdAt: '2022-04-03T00:05:42.004Z',
      updatedAt: '2022-04-03T02:05:16.958Z',
    },
    {
      id: '3',
      name: 'Maria',
      dob: '1970-04-04',
      imageUrl: '',
      address: '',
      description: 'Random description',
      createdAt: '2022-04-03T00:05:42.004Z',
      updatedAt: '2022-04-03T02:05:16.958Z',
    },
  ];

  it('should return list of users without params provided', async () => {
    const expected = {
      users: userList,
      cursor: undefined,
    };

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback(null, { Items: userList, LastEvaluatedKey: null });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getAll();
    expect(res).toStrictEqual(expected);
  });

  it('should return list of users matching name filter', async () => {
    const expected = {
      users: [userList[1]],
      cursor: undefined,
    };

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback(null, { Items: [userList[1]], LastEvaluatedKey: null });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getAll({ filter: 'Rodrigo' });
    expect(res).toStrictEqual(expected);
  });

  it('should return list of users matching limit', async () => {
    const expected = {
      users: userList,
      cursor: userList[userList.length - 1].id,
    };
    const limit = userList.length;

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback(null, {
        Items: userList,
        LastEvaluatedKey: { id: userList[userList.length - 1].id },
      });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getAll({ limit });
    expect(res).toStrictEqual(expected);
  });

  it('should return list of users with cursor provided', async () => {
    const expected = {
      users: [userList[userList.length - 1]],
      cursor: undefined,
    };
    const cursor = userList[userList.length - 2].id;

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback(null, {
        Items: [userList[userList.length - 1]],
        LastEvaluatedKey: null,
      });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getAll({ cursor });
    expect(res).toStrictEqual(expected);
  });

  it('should return empty list if no items on database', async () => {
    const expected = {
      users: [],
      cursor: undefined,
    };

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback(null, { Items: null, LastEvaluatedKey: null });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getAll();
    expect(res).toStrictEqual(expected);
  });

  it('should return error database throws error', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback({ message: 'Database error' }, null);
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    await expect(userService.getAll()).rejects.toThrow('Error while getting users.');
  });

  it('should return list of users when full params provided', async () => {
    const expected = {
      users: [userList[1]],
      cursor: undefined,
    };
    const limit = 1;
    const cursor = userList[0].id;

    AWSMock.mock('DynamoDB.DocumentClient', 'scan', (params: GetItemInput, callback: Function) => {
      callback(null, { Items: [userList[1]], LastEvaluatedKey: null });
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.getAll({ limit, filter: 'Rodrigo', cursor });
    expect(res).toStrictEqual(expected);
  });
});

// User create services tests
describe('Create user service', () => {
  const correctInput = {
    name: 'Rodrigo',
    dob: '1999-07-18',
    description: 'Random description',
    address: 'Lima, Peru',
  };

  const missingFieldsInput = {
    name: 'Rodrigo',
    description: 'Random description',
    address: 'Lima, Peru',
  };

  const wrongDateInput = {
    name: 'Rodrigo',
    dob: 'incorrect date',
    description: 'Random description',
  };

  it('should create a user correctly', async () => {
    const expected = {
      id: '1234',
      name: 'Rodrigo',
      dob: '1999-07-18',
      createdAt: '2022-04-03T00:05:42.004Z',
      description: 'Random description',
      address: 'Lima, Peru',
      imageUrl: undefined,
    };

    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: GetItemInput, callback: Function) => {
      callback(null, {});
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    const res = await userService.createUser(correctInput);
    expect(res).toEqual(expected);
  });

  it('should return error on missing mandatory attributes', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: GetItemInput, callback: Function) => {
      callback(null, {});
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    await expect(userService.createUser(missingFieldsInput)).rejects.toThrow('You must include all mandatory fields.');
  });

  it('should return error invalid dob provided', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: GetItemInput, callback: Function) => {
      callback(null, {});
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    await expect(userService.createUser(wrongDateInput)).rejects.toThrow('The provided date of birth is invalid.');
  });

  it('should return error on database error', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'put', (params: GetItemInput, callback: Function) => {
      callback({ message: 'Database error' }, null);
    });

    const dynamoDB = new aws.DynamoDB.DocumentClient();
    const userService = new UserService(dynamoDB, '');

    await expect(userService.createUser(correctInput)).rejects.toThrow('Error while creating user.');
  });
});
