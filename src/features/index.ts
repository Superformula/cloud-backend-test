import { gql } from 'apollo-server-express'
import { GraphQLUpload } from 'graphql-upload'
import { baseDefs } from '../common/base.schema'
import { DocumentNode } from 'graphql'

import _ from 'lodash'
import glob from 'glob'
import path from 'path'

export default async () => {
  let resolvers = {}

  const resolverFiles = glob.sync(path.join(__dirname, '/**/*.resolver.*'), {
    ignore: [path.join(__dirname, '/**/*.resolver.*.map')]
  })

  for (const file of resolverFiles) {
    const resolver = await import(file)
    _.merge(resolvers, [resolver.resolvers])
  }

  resolvers = {
    ...resolvers[0],
    Upload: GraphQLUpload
  }

  const schemaFiles = glob.sync(path.join(__dirname, '/**/*.schema.*'), {
    ignore: [path.join(__dirname, '/**/*.schema.*.map')]
  })
  let typeDefs: DocumentNode = gql`
    ${baseDefs}
  `

  for (const file of schemaFiles) {
    const schema = await import(file)
    typeDefs = gql`
      ${typeDefs}
      ${schema.typeDefs}
    `
  }

  return { resolvers, typeDefs }
}
