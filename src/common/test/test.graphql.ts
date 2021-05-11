import { contentType } from 'mime-types'
import { extname } from 'path'

export const graphqlFileRequest = (
  app,
  query: string,
  variables: { [x: string]: any } = {}
) => {
  const map = Object.assign(
    {},
    Object.keys(variables).map((key) => [`variables.${key}`])
  )

  const request = app
    .post('/graphql')
    .field('operations', JSON.stringify({ query }))
    .field('map', JSON.stringify(map))

  Object.values(variables).forEach((value, i) => {
    if (typeof value === 'string' && contentType(extname(value))) {
      request.attach(`${i}`, value)
    } else {
      request.field(`${i}`, value)
    }
  })

  return request
}

export const graphqlRequest = (
  app,
  query: string,
  variables: { [x: string]: any } = {}
) => {
  const request = app
    .post('/graphql')
    .send({
      query,
      variables
    })

  return request
}
