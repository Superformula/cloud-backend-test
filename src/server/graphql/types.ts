import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
	{ [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string;
	String: string;
	Boolean: boolean;
	Int: number;
	Float: number;
};

/** LocationInformation is the type of each location returned on the query that fetches relevant locations of a given input carries the property */
export type LocationInformation = {
	__typename?: 'LocationInformation';
	/** 'name' refers to the full name of the place/location */
	name: Scalars['String'];
	/** 'coordinates' is an array of two floats that represent the longitude and the latitude respectively */
	coordinates: Array<Scalars['Float']>;
};

/** Mutation is meant to expose all the APIs whose purpose is to manipulate the database somehow, be it creating, updating, or deleting data */
export type Mutation = {
	__typename?: 'Mutation';
	/** This is a dummy mutation that simply returns "Pong" */
	ping: Scalars['String'];
	/** This is the API to create a new user record with the data inside "input" */
	createUser: User;
	/** This is the API to update an existing user record whose ID is the parameter "id" with the data inside "input" */
	updateUser: User;
	/** This is the API to delete an existing user record whose ID is the parameter "id" */
	deleteUser: User;
};

/** Mutation is meant to expose all the APIs whose purpose is to manipulate the database somehow, be it creating, updating, or deleting data */
export type MutationCreateUserArgs = {
	input: UserCreationInput;
};

/** Mutation is meant to expose all the APIs whose purpose is to manipulate the database somehow, be it creating, updating, or deleting data */
export type MutationUpdateUserArgs = {
	id: Scalars['ID'];
	input: UserUpdateInput;
};

/** Mutation is meant to expose all the APIs whose purpose is to manipulate the database somehow, be it creating, updating, or deleting data */
export type MutationDeleteUserArgs = {
	id: Scalars['ID'];
};

/** Parameters used when paginating a list */
export type PaginationInput = {
	/** 'limit' refers to the number of elements of each page */
	limit?: Maybe<Scalars['Int']>;
	/** 'exclusiveStartId' is the ID of the last element of the previous page, and is used by DynamoDB as "checkpoint" when fetching the page */
	exclusiveStartId?: Maybe<Scalars['ID']>;
};

/** Query is meant to expose all the APIs whose purpose is to simply fetch data */
export type Query = {
	__typename?: 'Query';
	/** This is a dummy query that simply returns "Hello world!" */
	hello: Scalars['String'];
	/** This is the API to fetch data from a user whose ID is the parameter "id" */
	user: User;
	/**
	 * This is the API to fetch a paginated list of users. "paginationParams" includes information to deal with the pagination, and "nameFilter" will filter the user records by name,
	 * including only users whose name includes the value of the parameter "nameFilter". If no "paginationParams" is passed, a complete list will be returned, and if "nameFilter"
	 * is not passed, no filtering will be made.
	 */
	listUsers: UserPaginationResult;
	/** This API fetches and returns an array of a maximum of 5 locations from MapBox API, based on the given input, with the most relevant results first. Each location returned has the name of the fetched place and its coordinates. */
	location: Array<LocationInformation>;
};

/** Query is meant to expose all the APIs whose purpose is to simply fetch data */
export type QueryUserArgs = {
	id: Scalars['ID'];
};

/** Query is meant to expose all the APIs whose purpose is to simply fetch data */
export type QueryListUsersArgs = {
	paginationParams?: Maybe<PaginationInput>;
	nameFilter?: Maybe<Scalars['String']>;
};

/** Query is meant to expose all the APIs whose purpose is to simply fetch data */
export type QueryLocationArgs = {
	input: Scalars['String'];
};

/** User type */
export type User = {
	__typename?: 'User';
	/** ID of the user record (non-nullable) */
	_id: Scalars['ID'];
	/** Name of the user (non-nullable) */
	name: Scalars['String'];
	/** Date of birth of the user (non-nullable) */
	dob: Scalars['String'];
	/** Address of the user */
	address?: Maybe<Scalars['String']>;
	/** Description of the user */
	description?: Maybe<Scalars['String']>;
	/** The URL of the user image */
	imageUrl?: Maybe<Scalars['String']>;
	/** Date in UTC that represents when the user record was created (non-nullable) */
	createdAt: Scalars['String'];
	/** Date in UTC that represents the last time the user record was updated (non-nullable) */
	updatedAt: Scalars['String'];
};

/** Input used when creating a user */
export type UserCreationInput = {
	/** Name of the user (non-nullable) */
	name: Scalars['String'];
	/** Date of birth of the user (non-nullable) */
	dob: Scalars['String'];
	/** Address of the user */
	address?: Maybe<Scalars['String']>;
	/** Description of the user */
	description?: Maybe<Scalars['String']>;
	/** The URL of the user image */
	imageUrl?: Maybe<Scalars['String']>;
};

/** When listing users, this is the type that will be returned */
export type UserPaginationResult = {
	__typename?: 'UserPaginationResult';
	/** 'users' refers to the list of users of this page */
	users: Array<User>;
	/**
	 * 'lastEvaluatedId' is the ID of the last element of the page; its presence indicates that there are more elements to be fetched. When sending the request
	 * for the next page, include this value in the property "exclusiveStartId" of PaginationInput to indicate to DynamoDB where the last page stopped.
	 */
	lastEvaluatedId?: Maybe<Scalars['ID']>;
};

/** Input used when updating a user */
export type UserUpdateInput = {
	/** Name of the user */
	name?: Maybe<Scalars['String']>;
	/** Date of birth of the user */
	dob?: Maybe<Scalars['String']>;
	/** Address of the user */
	address?: Maybe<Scalars['String']>;
	/** Description of the user */
	description?: Maybe<Scalars['String']>;
	/** The URL of the user image */
	imageUrl?: Maybe<Scalars['String']>;
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
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
	| LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
	| NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
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
	info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
	obj: T,
	context: TContext,
	info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
	LocationInformation: ResolverTypeWrapper<LocationInformation>;
	String: ResolverTypeWrapper<Scalars['String']>;
	Float: ResolverTypeWrapper<Scalars['Float']>;
	Mutation: ResolverTypeWrapper<{}>;
	ID: ResolverTypeWrapper<Scalars['ID']>;
	PaginationInput: PaginationInput;
	Int: ResolverTypeWrapper<Scalars['Int']>;
	Query: ResolverTypeWrapper<{}>;
	User: ResolverTypeWrapper<User>;
	UserCreationInput: UserCreationInput;
	UserPaginationResult: ResolverTypeWrapper<UserPaginationResult>;
	UserUpdateInput: UserUpdateInput;
	Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	LocationInformation: LocationInformation;
	String: Scalars['String'];
	Float: Scalars['Float'];
	Mutation: {};
	ID: Scalars['ID'];
	PaginationInput: PaginationInput;
	Int: Scalars['Int'];
	Query: {};
	User: User;
	UserCreationInput: UserCreationInput;
	UserPaginationResult: UserPaginationResult;
	UserUpdateInput: UserUpdateInput;
	Boolean: Scalars['Boolean'];
};

export type LocationInformationResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['LocationInformation'] = ResolversParentTypes['LocationInformation']
> = {
	name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	coordinates?: Resolver<Array<ResolversTypes['Float']>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
	ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	createUser?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		RequireFields<MutationCreateUserArgs, 'input'>
	>;
	updateUser?: Resolver<
		ResolversTypes['User'],
		ParentType,
		ContextType,
		RequireFields<MutationUpdateUserArgs, 'id' | 'input'>
	>;
	deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
};

export type QueryResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
	hello?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
	listUsers?: Resolver<
		ResolversTypes['UserPaginationResult'],
		ParentType,
		ContextType,
		RequireFields<QueryListUsersArgs, never>
	>;
	location?: Resolver<
		Array<ResolversTypes['LocationInformation']>,
		ParentType,
		ContextType,
		RequireFields<QueryLocationArgs, 'input'>
	>;
};

export type UserResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
	_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
	name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	dob?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
	createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPaginationResultResolvers<
	ContextType = any,
	ParentType extends ResolversParentTypes['UserPaginationResult'] = ResolversParentTypes['UserPaginationResult']
> = {
	users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
	lastEvaluatedId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
	__isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
	LocationInformation?: LocationInformationResolvers<ContextType>;
	Mutation?: MutationResolvers<ContextType>;
	Query?: QueryResolvers<ContextType>;
	User?: UserResolvers<ContextType>;
	UserPaginationResult?: UserPaginationResultResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
