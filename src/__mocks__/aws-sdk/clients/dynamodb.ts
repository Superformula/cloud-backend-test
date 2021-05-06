// using this mock function we can mock different return values from AWS calls
export const awsResponse = jest.fn().mockReturnValue(Promise.resolve(true));

export const getFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
export const putFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
export const deleteFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
export const queryFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
export const scanFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
export const batchGetFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));

export class DocumentClient {
	get = getFn;
	put = putFn;
	delete = deleteFn;
	query = queryFn;
	scan = scanFn;
	batchGet = batchGetFn;
}
