import { UserModel } from '../db-models/user-model';
import { UserModelConverter } from '../model-converters/user-model-converter';
import { IRepo } from '../repositories/irepo';
import { UserCreationInput, UserUpdateInput } from './graphql';

export type DataSources = {
	userRepo: IRepo<UserModel, UserCreationInput, UserUpdateInput>;
};

export type Context = {
	dataSources: DataSources;
	userModelConverter: UserModelConverter;
};

export default Context;
