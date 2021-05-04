import { v4 as uuidv4 } from 'uuid';
import { dynamoDbClient } from '@sf/api/config';
import { PageInfo, PaginatedResponse, paginateResponse } from '@sf/api/utils/pagination';
import {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserFilter,
} from '@sf/core/user';
import { publishUser } from '@sf/api/subscriptions';
import { validateDob } from '@sf/api/utils/validators';

export const TableName = 'Users';

export interface UserService {
  userMatches(user: User, filter?: UserFilter): boolean;
  findAll(pageInfo: PageInfo, filter?: UserFilter): Promise<PaginatedResponse<User>>;
  findOne(id: string): Promise<User>;
  create(input: CreateUserInput): Promise<User>;
  update(input: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}

const generateImageUrl = (name: string): string =>
  `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;

export const userService: UserService = new (class implements UserService {
  userMatches(user: User, filter?: UserFilter): boolean {
    if (!filter) { return true; }
    if (!filter.name) { return true; }
    const regex = new RegExp(`${filter.name}`, 'i');
    return regex.test(user.name);
  }

  async findAll(pageInfo: PageInfo, filter?: UserFilter) {
    const { Items } = await dynamoDbClient.scan({ TableName }).promise();
    const users = Items as User[];
    const filtered = users.filter(user => this.userMatches(user, filter));
    return paginateResponse(filtered, pageInfo);
  }

  async findOne(id: string) {
    const response = await dynamoDbClient.get({ TableName, Key: { id } }).promise();
    const user = response.Item as User | undefined;
    if (!user) {
      console.error(`Invalid user id: ${id}`);
      throw new Error('Invalid user id');
    }
    return user;
  }

  async create(input: CreateUserInput) {
    const now = new Date();
    const { dob, ...others } = input;
    const id = uuidv4();
    validateDob(dob);

    await dynamoDbClient.put({
      TableName,
      Item: {
        ...others,
        id,
        dob,
        imageUrl: generateImageUrl(others.name),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    }).promise();

    const user = await this.findOne(id);
    publishUser(user, 'created');
    return user;
  }

  async update(input: UpdateUserInput) {
    const now = new Date();
    const { dob, ...others } = input;
    if (dob) {
      validateDob(dob);
    }

    const existingUser = await this.findOne(input.id);
    Object.assign(existingUser, {
      ...others,
      ...(dob ? { dob } : {}),
      imageUrl: generateImageUrl(others.name || existingUser.name),
      updatedAt: now.toISOString(),
    });

    await dynamoDbClient.put({
      TableName,
      Item: existingUser,
    }).promise();
    publishUser(existingUser, 'updated');

    return existingUser;
  }

  async delete(id) {
    const existingUser = await this.findOne(id);
    if (!existingUser) {
      throw new Error('Trying to delete non-existing user');
    }

    await dynamoDbClient.delete({
      TableName,
      Key: { id },
    }).promise();
    publishUser(existingUser, 'deleted');
  }
});
