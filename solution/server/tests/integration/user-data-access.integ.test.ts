import { describe, it, expect, afterAll } from '@jest/globals'
import rp from 'request-promise'
import { User, UserPaginatedResponse } from '../../src/types/types'

const baseAddress = 'http://localhost:3000/graphql'

describe('Data access - GetUserAsync tests', () => {
	it('should GetUserAsync work as expected', async () => {
		const userId = '5698760a-12ed-4dee-83bb-47f58d421d22'
		const query = `
            query {
                getUser(id: "${userId}"){
                    id
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		const user: User = response.data.getUser
		expect(user.id).toEqual(userId)
	})

	it('should GetUserAsync work as expected when fetching non-existent user', async () => {
		const userId = 'non-existent'
		const query = `
            query {
                getUser(id: "${userId}"){
                    id
                    name
                    dob
                    address {
                        place
                        latitude
                        longitude
                    }
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		expect(response.data).toBeNull()
		expect(response.errors).toBeTruthy()
	})
})

describe('Data access - UpdateUserAsync tests', () => {
	it('should UpdateUserAsync work as expected', async () => {
		const userId = '5698760a-12ed-4dee-83bb-47f58d421d22'
		const place = 'Seattle'
		const dob = '1999-11-12'
		const query = `
            mutation {
                updateUser(id: "${userId}", userInput: {
                    name: "Test"
                    dob: "${dob}"
                    address: {
                        place: "${place}"
                        latitude: -30
                        longitude: -19
                    }
                }){
                    id
                    name
                    dob
                    address {
                        place
                        latitude
                        longitude
                    }
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		const user: User = response.data.updateUser
		expect(user.id).toEqual(userId)
		expect(user.address?.place).toEqual(place)
		expect(user.dob).toEqual(dob)
	})

	it('should UpdateUserAsync returns and error when updating non-existent user', async () => {
		const userId = 'non-existent'
		const place = 'Seattle'
		const dob = '1999-11-12'
		const query = `
            mutation {
                updateUser(id: "${userId}", userInput: {
                    name: "Test"
                    dob: "${dob}"
                    address: {
                        place: "${place}"
                        latitude: -30
                        longitude: -19
                    }
                }){
                    id
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		expect(response.data).toBeNull()
		expect(response.errors).toBeTruthy()
	})

	it('should UpdateUserAsync returns and error when updating user with invalid address', async () => {
		const userId = '5698760a-12ed-4dee-83bb-47f58d421d22'
		const place = 'Seattle'
		const dob = '1999-11-12'
		const query = `
            mutation {
                updateUser(id: "${userId}", userInput: {
                    name: "Test"
                    dob: "${dob}"
                    address: {
                        place: "${place}"
                        latitude: -30
                    }
                }){
                    id
                }
            }
        `

		try {
			await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		} catch (ex) {
			// Checks if the GraphQL errors were received
			expect(ex.error.errors).toBeTruthy()
		}
	})
})

describe('Data access - AddUserAsync tests', () => {
	const createdIds: string[] = []

	// Clear all created users
	afterAll(async () => {
		for (const id of createdIds) {
			const query = `
            mutation {
                deleteUser(id: "${id}")
            }`
			await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		}
	}, 600000)

	it('should AddUserAsync work as expected', async () => {
		const name = 'New Test Name'
		const place = 'Seattle'
		const dob = '1999-10-12'
		const latitude = 90
		const longitude = 45

		const query = `
            mutation {
                addUser(userInput: {
                    name: "${name}"
                    dob: "${dob}"
                    address: {
                        place: "${place}"
                        longitude: ${longitude}
                        latitude: ${latitude}
                    }
                }){
                    id
                    name
                    dob
                    address{
                        place
                        longitude
                        latitude
                    }
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		const user: User = response.data.addUser

		expect(user.name).toEqual(name)
		expect(user.address?.place).toEqual(place)
		expect(user.address?.longitude).toEqual(longitude)
		expect(user.address?.latitude).toEqual(latitude)
		expect(user.dob).toEqual(dob)

		createdIds.push(user.id)
	})
})

describe('Data access - DeleteUserAsync tests', () => {
	it('should DeleteUserAsync work as expected', async () => {
		const userId = await addUserAsync()

		const query = `
            mutation {
                deleteUser(id: "${userId}")
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		const success: boolean = response.data.deleteUser

		expect(success).toEqual(true)
	})
})

describe('Data access - ListUserAsync tests', () => {
	it('should ListUserAsync work as expected', async () => {
		const query = `
            query {
                listUsers(params: {
                }){
                    users {
                        id
                    }
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		const pagResponse: UserPaginatedResponse = response.data.listUsers

		expect(pagResponse.users).toBeTruthy()
		expect(pagResponse.users?.length).toBeGreaterThan(0)
	})
})

const addUserAsync = async (): Promise<string> => {
	const query = `
                mutation {
                    addUser(userInput: {
                        name: "Test name"
                    }){
                        id
                    }
                }
            `
	const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
	const user: User = response.data.addUser
	return user.id
}
