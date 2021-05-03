import { UserModelConverter } from '../model-converters/user-model-converter';
import UserRepo from '../repositories/user-repo';

export type DataSources = {
	userRepo: UserRepo;
};

export type Context = {
	dataSources: DataSources;
	userModelConverter: UserModelConverter;
};

export default Context;
