// using this mock function we can mock different return values from AWS calls
export const awsResponse = jest.fn().mockReturnValue(Promise.resolve(true));

export const getFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
const putFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
const deleteFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
const queryFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
const scanFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));
const batchGetFn = jest.fn().mockImplementation(() => ({ promise: awsResponse }));

export class DocumentClient {
	get = getFn;
	put = putFn;
	delete = deleteFn;
	query = queryFn;
	scan = scanFn;
	batchGet = batchGetFn;
}
