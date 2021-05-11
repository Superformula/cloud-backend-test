import '@/models'
import { UserService } from '@/features/users/user.service'
import { User } from '@/models/user.model'
import { datatype, lorem, name, address } from 'faker'
import { NotFoundError } from '@/common/error'
import { S3Provider } from '@/providers/s3.provider'
import moment from 'moment'

describe('User Service', () => {
  const s3Provider = new S3Provider()
  const userService = new UserService(s3Provider)

  let user: User
  let userData: any

  beforeAll(async () => {
    userData = {
      name: `${name.firstName()} ${name.lastName()}`,
      dob: moment().format('DD-MM-YYYY'),
      address: address.streetAddress(),
      description: lorem.sentence()
    }
  })

  it('Create a user', async () => {
    user = await userService.create(userData)

    expect(user).toMatchObject({
      name: userData.name,
      address: userData.address,
      description: userData.description
    })
    expect(user).toHaveProperty('id')
  })

  it('Update a user', async () => {
    userData.name = `${name.firstName()} ${name.lastName()}`
    userData.id = user.id

    const updatedUser = await userService.update(userData)

    expect(updatedUser).toMatchObject({
      id: userData.id,
      name: userData.name,
    })

    user.name = userData.name
  })

  it('Get all', async () => {
    const foundUsers = await userService.findAll()

    expect(foundUsers.length).toBeGreaterThan(0)
    expect(foundUsers.find(
      f => f['dataValues'].name === user.name && f['dataValues'].id === user.id)
    ).toBeTruthy()
  })

  it('Get by id', async () => {
    const foundUser = await userService.find(user.id)

    expect(foundUser).not.toBeNull()
    expect(foundUser?.id).toEqual(user.id)
  })

  it('Update by id not found error', async () => {
    await expect(async () => {
      await userService.update({
        id: datatype.uuid()
      } as User)
    }).rejects.toThrow(NotFoundError)
  })

  it('Delete', async () => {
    await userService.delete(user.id)
    const deletedUser = await userService.find(user.id)

    expect(deletedUser).toBeNull()
  })
})
