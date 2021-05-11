import { i18n } from '@/loaders/i18n'
import { GraphQLError } from 'graphql'
import { UserInputError } from 'apollo-server-express'

function formatError(error: GraphQLError): any {
  if (error.extensions?.code === 'GRAPHQL_VALIDATION_FAILED') {
    if (error.message.indexOf('required type') != -1) {
      const properties = error.message.match(/(["'])(?:\\.|[^\\])*?\1/)

      const field = properties![0]
        .toString()
        .replace(/['"]+/g, '')
        .split('.')
        .pop()

      return new UserInputError(
        i18n.__('errors.required_field', i18n.__(`labels.${field}`)),
        { field, code: '422' }
      )
    }
  }

  return error
}

export { formatError }
