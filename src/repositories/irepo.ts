import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Maybe, PaginationInput } from '../graphql/types';

export type PaginationOutputModel<T> = {
	items: T[];
	count: number;
	scannedCount: number;
	lastEvaluatedKey?: DocumentClient.Key;
};

export interface IRepo<TModel, TCreationModel, TUpdateModel> {
	getItem(id: string): Promise<TModel>;
	listItems(
		paginationInput?: Maybe<PaginationInput>,
		filterValue?: Maybe<string>,
	): Promise<PaginationOutputModel<TModel>>; // TODO: make this method more generic, so that it can be used by any other Repo other than UserRepo
	putItem(input: TCreationModel): Promise<TModel>;
	updateItem(id: string, input: TUpdateModel): Promise<TModel>;
	deleteItem(id: string): Promise<TModel>;
}

export default IRepo;
