import { v4 } from 'uuid'
import cityGenerator from '../utils/cities.list'
import nameGenerator from '../utils/names.list'
import { randomDob, randomCreatedAt } from '../utils/date.utils'


/**
 * defines a user object
 */
export default class UserModel {
	id: string | null
	dob: string | null
	name: string | null
	address: string | null
	imageUrl: string | null
	createdAt: string | null
	updatedAt: string | null
	description: string | null

	/**
	 * default constructor
	 * @param {Record<string, unknown>} payload an input object to populate the new model
	 */
	constructor(payload: Record<string, string> = {}) {
		this.id = payload.id || null
		this.dob = payload.dob || null
		this.name = payload.name || null
		this.address = payload.address || null
		this.imageUrl = payload.imageUrl || null
		this.createdAt = payload.createdAt || null
		this.updatedAt = payload.updatedAt || null
		this.description = payload.description || null
	}

	/**
	 * when the item's id is null, we generates random values for id, name and address
	 * Otherwise this means that the object already exists in the database
	 */
	generateRandomValues(): void
	{
		this.id = v4()
		this.dob = randomDob()
		this.name = nameGenerator()
		this.address = cityGenerator()
		this.createdAt = randomCreatedAt()
	}
}