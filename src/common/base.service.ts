import { ISearchInput } from '@/common/interfaces/search.interface'
import { Op } from 'sequelize'

export class BaseService {
  getErrors(error) {
    if (
      error.data?.status &&
      error.data.errors &&
      error.data.errors.length > 0
    ) {
      return { status: error.data.status, errors: error.data.errors }
    }

    const errors: any = []
    let status = 0
    if (
      error.name === 'SequelizeValidationError' ||
      error.name === 'SequelizeUniqueConstraintError'
    ) {
      if (error.errors.length > 0) {
        for (const item of error.errors) {
          errors.push({
            field: item.path,
            message: item.message
          })
        }
      }

      status = 422
    } else if (error.name === 'StatusCodeError') {
      if (error.error.errors.length > 0) {
        for (const item of error.error.errors) {
          errors.push({
            field: item.path,
            message: item.description
          })
        }
      }

      status = 400
    } else {
      errors.push({
        field: null,
        message: error?.message
      })
      status = error.data?.status ? error.data.status : 500
    }

    return { status, errors }
  }
}
