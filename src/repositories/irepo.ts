export interface IRepo<TModel, TCreationModel, TUpdateModel> {
	getItem(id: string): Promise<TModel>;
	putItem(input: TCreationModel): Promise<TModel>;
	updateItem(id: string, input: TUpdateModel): Promise<TModel>;
	deleteItem(id: string): Promise<TModel>;
}

export default IRepo;
