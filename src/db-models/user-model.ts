import { Maybe } from '../types/graphql';

export type UserModel = {
	id: string;
	name: string;
	dob: string;
	address?: Maybe<string>;
	description?: Maybe<string>;
	imageUrl?: Maybe<string>;
	createdAt: string;
	updatedAt: string;
};

export default UserModel;
