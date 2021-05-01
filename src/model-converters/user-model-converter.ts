import { UserModel } from '../db-models/user-model';
import { User } from '../types/graphql';

export class UserModelConverter {
	fromDbModelToGraphQLModel(dbModel: UserModel): User {
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
}

export default UserModelConverter;
