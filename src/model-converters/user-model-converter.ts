import { UserCreationModel, UserModel, UserUpdateModel } from '../db-models/user-models';
import { User, UserCreationInput, UserPaginationResult, UserUpdateInput } from '../graphql/types';
import { PaginationOutputModel } from '../repositories/irepo';

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
			name: input.name || undefined,
			dob: input.dob || undefined,
			address: input.address,
			description: input.description,
			imageUrl: input.imageUrl,
		};
	}

	fromPaginationOutputModelToUserPaginationResult(pagOutput: PaginationOutputModel<UserModel>): UserPaginationResult {
		let lastEvaluatedId: string | undefined;

		if (pagOutput.lastEvaluatedKey) {
			lastEvaluatedId = pagOutput.lastEvaluatedKey['id'];
		}

		return {
			users: pagOutput.items.map((user) => this.fromDbModelToGqlModel(user)),
			lastEvaluatedId,
		};
	}
}

export default UserModelConverter;
