import { Maybe } from 'graphql/jsutils/Maybe';

export interface UserModel {
	id: string;
	name: string;
	dob: string;
	address: string;
	description?: string;
	createdAt: string;
	updatedAt?: string;
}

export interface UserPageModel {
	items: UserModel[];
	cursor: Maybe<string>;
}
