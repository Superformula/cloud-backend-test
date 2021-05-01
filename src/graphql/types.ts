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

/** Mutation is meant to expose all the APIs whose purpose is to manipulate the database somehow, be it creating, updating, or deleting data */
export type Mutation = {
	__typename?: 'Mutation';
	ping: Scalars['String'];
	createUser: User;
	updateUser: User;
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

/** Query is meant to expose all the APIs whose purpose is to simply fetch data */
export type Query = {
	__typename?: 'Query';
	hello: Scalars['String'];
	user: User;
};

/** Query is meant to expose all the APIs whose purpose is to simply fetch data */
export type QueryUserArgs = {
	id: Scalars['ID'];
};

/** User type */
export type User = {
	__typename?: 'User';
	_id: Scalars['ID'];
	name: Scalars['String'];
	dob: Scalars['String'];
	address?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
	imageUrl?: Maybe<Scalars['String']>;
	createdAt: Scalars['String'];
	updatedAt: Scalars['String'];
};

/** Create user input type */
export type UserCreationInput = {
	name: Scalars['String'];
	dob: Scalars['String'];
	address?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
	imageUrl?: Maybe<Scalars['String']>;
};

/** Update user input type */
export type UserUpdateInput = {
	name?: Maybe<Scalars['String']>;
	dob?: Maybe<Scalars['String']>;
	address?: Maybe<Scalars['String']>;
	description?: Maybe<Scalars['String']>;
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
	Mutation: ResolverTypeWrapper<{}>;
	String: ResolverTypeWrapper<Scalars['String']>;
	ID: ResolverTypeWrapper<Scalars['ID']>;
	Query: ResolverTypeWrapper<{}>;
	User: ResolverTypeWrapper<User>;
	UserCreationInput: UserCreationInput;
	UserUpdateInput: UserUpdateInput;
	Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
	Mutation: {};
	String: Scalars['String'];
	ID: Scalars['ID'];
	Query: {};
	User: User;
	UserCreationInput: UserCreationInput;
	UserUpdateInput: UserUpdateInput;
	Boolean: Scalars['Boolean'];
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

export type Resolvers<ContextType = any> = {
	Mutation?: MutationResolvers<ContextType>;
	Query?: QueryResolvers<ContextType>;
	User?: UserResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
