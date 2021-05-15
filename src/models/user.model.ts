import { v4 } from 'uuid'
import cityGenerator from '../utils/cities.list'
import nameGenerator from '../utils/names.list'
import { randomDob, randomCreatedAt } from '../utils/date.utils'

const classProperties = [
	{ name: `id`, type: `string` },
	{ name: `dob`, type: `string` },
	{ name: `name`, type: `string` },
	{ name: `address`, type: `string` },
	{ name: `imageUrl`, type: `string` },
	{ name: `createdAt`, type: `string` },
	{ name: `updatedAt`, type: `string` },
	{ name: `description`, type: `string` }
]

/**
 * defines a user object
 */
export default class UserModel {
	id: string
	dob: string
	name: string
	address: string
	imageUrl: string
	createdAt: string
	updatedAt: string
	description: string

	/**
	 * default constructor
	 * @param {Record<string, unknown>} payload an input object to populate the new model
	 */
	constructor(payload: Record<string, unknown> = {}) {
		for (const property of classProperties)
			if (payload[property.name] && typeof payload[property.name] === property.type)
				this[property.name] = payload[property.name]
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