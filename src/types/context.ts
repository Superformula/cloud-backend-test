import { UserModelConverter } from '../model-converters/user-model-converter';
import UserDataSource from '../data-sources/user-data-source';
import { LocationDataSource } from '../data-sources/location-data-source';
import { LocationModelConverter } from '../model-converters/location-model-converter';

export type DataSources = {
	userDataSource: UserDataSource;
	locationDataSource: LocationDataSource;
};

export type Context = {
	dataSources: DataSources;
	userModelConverter: UserModelConverter;
	locationModelConverter: LocationModelConverter;
};

export default Context;
