import axios from 'axios'
require('dotenv').config()

describe('Test GraphQL API', () => {
  test('Get all users', async () => {
    const response = await axios({
      url: process.env.API_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': `${process.env.API_KEY}`,
      },
      data: {
        query: `
          query All {
            listUsers {
              items {
                id
                name
                dob
                address
                imageUrl
                updatedAt
              }
            }
          }`,
      },
    })

    expect(response.status).toBe(200)
    expect(response).toHaveProperty('data')
    expect(response.data.data).toHaveProperty('listUsers')
  })
})
