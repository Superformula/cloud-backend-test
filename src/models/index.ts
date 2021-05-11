import { Sequelize } from 'sequelize-typescript'
import * as config from '@/config/database'
import path from 'path'

const env = process.env.NODE_ENV || 'development'

const sequelize: Sequelize = new Sequelize({
  ...config[env],
  logging: false,
  models: [path.join(__dirname, '/*.model.*')],
  modelMatch: (filename, member) => {
    const sanitizeFilename = filename
      .substring(0, filename.indexOf('.model'))
      .split('-')
      .join('')
    return sanitizeFilename === member.toLowerCase()
  }
})

export { sequelize }