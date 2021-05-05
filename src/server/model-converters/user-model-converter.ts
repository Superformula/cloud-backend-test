import { UserCreationModel, UserModel, UserUpdateModel } from '../data-source-models/user-models';
import { User, UserCreationInput, UserPaginationResult, UserUpdateInput } from '../graphql/types';
import { PaginationOutputModel } from '../data-source-models/pagination-output-model';

// This class is meant to decouple the models from graphQL API from the models that are used with our database tables.
// With UserModelConverter, we stopped using graphQL input models directly when creating or updating a user, for example.
export class UserModelConverter {
	fromDbModelToGqlModel(dbModel: UserModel): User {
		return {
			_id: dbModel.id,
			name: dbModel.name,
			dob: dbModel.dob,
			address: dbModel.address,
			description: dbModel.description,
			imageUrl: dbModel.imageUrl,
			createdAt: dbModel.createdAt,
			updatedAt: dbModel.updatedAt,
		};
	}

	fromGqlCreationInputToDbCreationModel(input: UserCreationInput): UserCreationModel {
		return {
			name: input.name,
			dob: input.dob,
			address: input.address,
			description: input.description,
			imageUrl: input.imageUrl,
		};
	}

	fromGqlUpdateInputToDbUpdateModel(input: UserUpdateInput): UserUpdateModel {
		// no undefined properties will be sent to DynamoDB "update" command,
		// since method buildSimpleUpdateItemInput from utils.ts won't include them
		return {
			name: input.name || undefined, // this prevents 'name' from receiving null. Since buildSimpleUpdateItemInput won't include undefined properties, we are making sure to only include 'name' if it is not empty.
			dob: input.dob || undefined, // this prevents 'dob' from receiving null. Since buildSimpleUpdateItemInput won't include undefined properties, we are making sure to only include 'dob' if it is not empty.
			address: input.address,
			description: input.description,
			imageUrl: input.imageUrl,
		};
	}

	fromPaginationOutputModelToUserPaginationResult(pagOutput: PaginationOutputModel<UserModel>): UserPaginationResult {
		return {
			users: pagOutput.items.map((user) => this.fromDbModelToGqlModel(user)),
			lastEvaluatedId: pagOutput.lastEvaluatedKey ? pagOutput.lastEvaluatedKey['id'] : undefined,
		};
	}
}

export default UserModelConverter;
