import { UserModel } from '../db-models/user-models';
import { UserModelConverter } from '../model-converters/user-model-converter';
import { IRepo } from '../repositories/irepo';
import { UserCreationInput, UserUpdateInput } from '../graphql/types';

export type DataSources = {
	userRepo: IRepo<UserModel, UserCreationInput, UserUpdateInput>;
};

export type Context = {
	dataSources: DataSources;
	userModelConverter: UserModelConverter;
};

export default Context;
