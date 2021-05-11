import expressLoader from './express'
import graphqlLoader from './graphql'
import logger from './logger'
import '@/models'

export default ({ app }) => {
  // Initializing database, logs and express
  logger()
  expressLoader({ app })
  graphqlLoader({ app })
}
