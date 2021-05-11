import winston from 'winston'

export default () => {
  let transports: any = []

  // if (process.env.NODE_ENV !== 'production') {
  //   transports.push(
  //     new winston.transports.Console({
  //       format: winston.format.simple()
  //     })
  //   )
  // } else {
  transports.push(
    new winston.transports.File({
      filename: 'log/errors.log',
      level: 'error'
    }),
    new winston.transports.File({ filename: 'log/info.log', level: 'info' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  )
  // }

  winston.configure({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.json()
    ),
    defaultMeta: { service: 'api-service' },
    transports: transports
  })
}
