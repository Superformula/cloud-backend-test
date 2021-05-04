import { UserModel } from '../data-access/models/user';
import { mapUser } from './user-mapper';
import { v4 as uuid } from 'uuid';

describe('Test UserModel mapping', () => {
	const user: UserModel = {
		id: uuid(),
		address: 'Brasilia, Brazil',
		dob: '1995-09-03T00:00:00.000Z',
		name: 'Test user',
		description: 'Test description',
		createdAt: '2021-05-01T17:52:48.299Z',
		updatedAt: '2021-06-01T17:52:48.299Z',
	};

	it('Should return a correct user', () => {
		const mapped = mapUser(user);

		expect(mapped.name).toBe(user.name);
		expect(mapped.address).toBe(user.address);
		expect(mapped.createdAt).toBe(user.createdAt);
		expect(mapped.updatedAt).toBe(user.updatedAt);
		expect(mapped.description).toBe(user.description);
		expect(mapped.dob).toBe(user.dob);
		expect(mapped.id).toBe(user.id);
	});
});
