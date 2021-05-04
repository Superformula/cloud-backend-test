import { UserModel } from '../data-access/models/user';
import { User } from '../graphql/types/schema-types';

export const mapUser = (userModel: UserModel): User => ({
	id: userModel.id,
	address: userModel.address,
	dob: userModel.dob,
	createdAt: userModel.createdAt,
	name: userModel.name,
	description: userModel.description,
	updatedAt: userModel.updatedAt,
	imageUrl: `https://picsum.photos/seed/${userModel.id}/200/300`,
});
