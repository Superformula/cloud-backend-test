import { UserModelConverter } from '../model-converters/user-model-converter';
import UserDataSource from '../data-sources/user-data-source';

export type DataSources = {
	userDataSource: UserDataSource;
};

export type Context = {
	dataSources: DataSources;
	userModelConverter: UserModelConverter;
};

export default Context;
