import { Maybe } from '../graphql/types';

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
