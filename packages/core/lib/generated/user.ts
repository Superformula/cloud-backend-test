import { gql } from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  IsoDateScalar: string;
};

export type CreateUserInput = {
  name: Scalars['String'];
  dob: Scalars['IsoDateScalar'];
  address: Scalars['String'];
  description: Scalars['String'];
};


export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  updateUser: User;
  deleteUser: Scalars['Boolean'];
};


export type MutationCreateUserArgs = {
  user: CreateUserInput;
};


export type MutationUpdateUserArgs = {
  user: UpdateUserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};

export type PageInfo = {
  offset: Scalars['Int'];
  limit: Scalars['Int'];
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  offset: Scalars['Int'];
  total: Scalars['Int'];
  users: Array<User>;
};

export type Query = {
  __typename?: 'Query';
  listUsers: PaginatedUsers;
  getUser: User;
};


export type QueryListUsersArgs = {
  pageInfo: PageInfo;
  filter?: Maybe<UserFilter>;
};


export type QueryGetUserArgs = {
  id: Scalars['String'];
};

export type SubscribeToUser = {
  __typename?: 'SubscribeToUser';
  user: User;
  event: UserEvent;
};

export type Subscription = {
  __typename?: 'Subscription';
  subscribeToUser: SubscribeToUser;
};


export type SubscriptionSubscribeToUserArgs = {
  filter?: Maybe<UserFilter>;
};

export type UpdateUserInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['IsoDateScalar']>;
  address?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  dob: Scalars['IsoDateScalar'];
  address: Scalars['String'];
  description: Scalars['String'];
  imageUrl: Scalars['String'];
  createdAt: Scalars['IsoDateScalar'];
  updatedAt: Scalars['IsoDateScalar'];
};

export type UserEvent =
  | 'created'
  | 'updated'
  | 'deleted';

export type UserFilter = {
  name: Scalars['String'];
};
