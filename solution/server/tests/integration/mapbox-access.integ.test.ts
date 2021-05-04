import { describe, it, expect } from '@jest/globals'
import rp from 'request-promise'
import { Address } from '../../src/types/types'

const baseAddress = 'http://localhost:3000/graphql'

describe('Mapbox access - queryAddress tests', () => {
	it('should queryAddress work as expected', async () => {
		const location = 'Seattle, Washington'
		const query = `
            query {
                queryAddress(location: "${location}"){
                    latitude
                    longitude
                    place
                }
            }
        `
		const response = await rp({ method: 'POST', uri: baseAddress, body: { query }, json: true })
		const addressList: Address[] = response.data.queryAddress
		expect(addressList).toBeTruthy()
	})
})
