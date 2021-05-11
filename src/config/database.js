require('dotenv').config()

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    seederStorage: 'sequelize'
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT_TEST,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    seederStorage: 'sequelize'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    },
    seederStorage: 'sequelize'
  },
}

module.exports = config
