import { graphqlRequest, graphqlFileRequest } from '@/common/test/test.graphql'
import UserPayloads from './user.graphql-payloads'
import { User } from '@/models/user.model'
import { server } from '@/server/server'
import supertest from 'supertest'
import { name, lorem, address } from 'faker'
import moment from 'moment'
import { S3Provider } from '@/providers/s3.provider'
import userGraphqlPayloads from './user.graphql-payloads'
const request = supertest.agent(server)

describe('Graphql user tests', () => {
  let userData
  let createdUser: User, createdUserWithImage: User
  let s3Provider: S3Provider

  beforeAll(async (done) => {
    userData = {
      name: `${name.firstName()} ${name.lastName()}`,
      dob: moment().format('DD-MM-YYYY'),
      address: address.streetAddress(),
      description: lorem.sentence()
    }

    s3Provider = new S3Provider()

    done()
  })

  afterAll(async (done) => {
    server.close()
    done()
  })

  it('Create a user', async () => {
    const createResponse = await graphqlRequest(
      request,
      UserPayloads.createUser,
      userData
    )

    createdUser = createResponse.body.data?.createUser
    expect(createdUser).toMatchObject({
      name: userData.name,
      address: userData.address,
      description: userData.description
    })
    expect(createdUser).toHaveProperty('id')
  })

  it('Create a user with image', async () => {
    const createResponse = await graphqlFileRequest(
      request,
      UserPayloads.createUserWithImage(
        userData
      ),
      {
        image: `${__dirname}/../../../../resources/postgres.png`
      }
    )

    createdUserWithImage = createResponse.body.data?.createUser
    expect(createdUserWithImage).toMatchObject({
      name: userData.name,
      address: userData.address,
      description: userData.description
    })
    expect(createdUserWithImage).toHaveProperty('id')
    expect(createdUserWithImage).toHaveProperty('imageUrl')
  })

  it('Update a user', async () => {
    createdUser.name = `${name.firstName()} ${name.lastName()}`

    const updateResponse = await graphqlRequest(
      request,
      UserPayloads.updateUser,
      createdUser
    )

    const updateUser = updateResponse.body.data?.updateUser
    expect(updateUser).toMatchObject({
      name: createdUser.name,
      address: userData.address,
      description: userData.description
    })
  })

  it('Update a user with Image', async () => {
    const updateResponse = await graphqlFileRequest(
      request,
      UserPayloads.updateUserWithImage(createdUser),
      {
        image: `${__dirname}/../../../../resources/postgres.png`
      }
    )

    const updateUserWithImage = updateResponse.body.data?.updateUser
    expect(updateUserWithImage).toMatchObject({
      id: createdUser.id,
      name: createdUser.name,
      address: createdUser.address,
      description: createdUser.description
    })
    expect(updateUserWithImage).toHaveProperty('imageUrl')

    await s3Provider.delete(updateUserWithImage.imageUrl)
  })

  it('Get a user by id', async () => {
    const getResponse = await graphqlRequest(
      request,
      userGraphqlPayloads.user,
      {
        id: createdUserWithImage.id
      }
    )

    const user = getResponse.body.data.user

    expect(user).toMatchObject({
      id: createdUserWithImage.id,
      name: createdUserWithImage.name,
      address: createdUserWithImage.address,
      description: createdUserWithImage.description,
      imageUrl: createdUserWithImage.imageUrl
    })
  })

  it('Delete a user', async () => {
    const deleteResponse = await graphqlRequest(
      request,
      userGraphqlPayloads.deleteUser,
      {
        id: createdUserWithImage.id
      }
    )
    expect(deleteResponse.body).toEqual({
      data: { deleteUser: true }
    })
  })

  it('Get users', async () => {
    const getResponse = await graphqlRequest(
      request,
      userGraphqlPayloads.users,
      {
        name: createdUser.name.substr(0, 2)
      }
    )

    const users = getResponse.body.data.users

    expect(users.length).toEqual(1)
    expect(users[0]).toMatchObject({
      id: createdUser.id,
      name: createdUser.name,
      address: createdUser.address,
      description: createdUser.description
    })
  })
})
