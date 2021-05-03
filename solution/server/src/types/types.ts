import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** The Address type. */
export type Address = {
  __typename?: 'Address';
  /** Name of the place */
  place: Scalars['String'];
  /** Latitude of the address */
  latitude: Scalars['Float'];
  /** Latitude of the address */
  longitude: Scalars['Float'];
};

/** Address input data */
export type AddressInput = {
  /** Name of the place */
  place: Scalars['String'];
  /** Latitude of the address */
  latitude: Scalars['Float'];
  /** Latitude of the address */
  longitude: Scalars['Float'];
};

/** User Mutations. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Add a new User. */
  addUser: User;
  /** Update an existing User. */
  updateUser: User;
  /** Delete a existing User. */
  deleteUser: Scalars['Boolean'];
};


/** User Mutations. */
export type MutationAddUserArgs = {
  userInput: UserInput;
};


/** User Mutations. */
export type MutationUpdateUserArgs = {
  id: Scalars['String'];
  userInput: UserInput;
};


/** User Mutations. */
export type MutationDeleteUserArgs = {
  id: Scalars['String'];
};

/** User Queries. */
export type Query = {
  __typename?: 'Query';
  /** Retrieves an user from the received id */
  getUser: User;
  /** List users with pagination and filtering */
  listUsers: UserPaginatedResponse;
  /** Translates a string from a given language into a different language. */
  queryAddress?: Maybe<Array<Address>>;
};


/** User Queries. */
export type QueryGetUserArgs = {
  id: Scalars['String'];
};


/** User Queries. */
export type QueryListUsersArgs = {
  params?: Maybe<UserListParams>;
};


/** User Queries. */
export type QueryQueryAddressArgs = {
  location: Scalars['String'];
};

/** The User type. */
export type User = {
  __typename?: 'User';
  /** User's id */
  id: Scalars['ID'];
  /** User's name */
  name: Scalars['String'];
  /** User's date of birth */
  dob?: Maybe<Scalars['String']>;
  /** User's address */
  address?: Maybe<Address>;
  /** User's description */
  description?: Maybe<Scalars['String']>;
  /** User's date of creation */
  createdAt?: Maybe<Scalars['String']>;
  /** User's date of last update */
  updatedAt?: Maybe<Scalars['String']>;
  /** User's image url */
  imageUrl?: Maybe<Scalars['String']>;
};

/** User input data */
export type UserInput = {
  /** User's name */
  name?: Maybe<Scalars['String']>;
  /** User's date of birth */
  dob?: Maybe<Scalars['String']>;
  /** User's address */
  address?: Maybe<AddressInput>;
  /** User's description */
  description?: Maybe<Scalars['String']>;
  /** User's image url */
  imageUrl?: Maybe<Scalars['String']>;
};

/** User listing params */
export type UserListParams = {
  /** Key used for pagination, must be passed when it's defined */
  lastEvaluatedKey?: Maybe<Scalars['String']>;
  /** Maximum results to retrieve */
  limit?: Maybe<Scalars['Int']>;
  /** String filter */
  filter?: Maybe<Scalars['String']>;
};

/** User query paginated response */
export type UserPaginatedResponse = {
  __typename?: 'UserPaginatedResponse';
  /** User list */
  users?: Maybe<Array<User>>;
  /** Key used for pagination, must be passed when it's defined */
  lastEvaluatedKey?: Maybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  AddressInput: AddressInput;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Query: ResolverTypeWrapper<{}>;
  User: ResolverTypeWrapper<User>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  UserInput: UserInput;
  UserListParams: UserListParams;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  UserPaginatedResponse: ResolverTypeWrapper<UserPaginatedResponse>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  String: Scalars['String'];
  Float: Scalars['Float'];
  AddressInput: AddressInput;
  Mutation: {};
  Boolean: Scalars['Boolean'];
  Query: {};
  User: User;
  ID: Scalars['ID'];
  UserInput: UserInput;
  UserListParams: UserListParams;
  Int: Scalars['Int'];
  UserPaginatedResponse: UserPaginatedResponse;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  place?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  latitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  longitude?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationAddUserArgs, 'userInput'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'userInput'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  listUsers?: Resolver<ResolversTypes['UserPaginatedResponse'], ParentType, ContextType, RequireFields<QueryListUsersArgs, never>>;
  queryAddress?: Resolver<Maybe<Array<ResolversTypes['Address']>>, ParentType, ContextType, RequireFields<QueryQueryAddressArgs, 'location'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dob?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPaginatedResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPaginatedResponse'] = ResolversParentTypes['UserPaginatedResponse']> = {
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  lastEvaluatedKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPaginatedResponse?: UserPaginatedResponseResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
