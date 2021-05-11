import { i18n } from '@/loaders/i18n'
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript'

@Table({
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  freezeTableName: true,
  tableName: 'users'
})
export class User extends Model {
  @PrimaryKey
  @Column({
    defaultValue: DataType.UUIDV4
  })
  id: string

  @AllowNull(false)
  @Column({
    type: DataType.STRING(150),
    validate: {
      notNull: {
        msg: i18n.__('errors.required_field', i18n.__('labels.name'))
      }
    }
  })
  name: string

  @AllowNull(false)
  @Column({
    type: DataType.DATEONLY,
    validate: {
      notNull: {
        msg: i18n.__('errors.required_field', i18n.__('labels.dob'))
      }
    }
  })
  dob: Date

  @AllowNull(false)
  @Column({
    type: DataType.STRING(250),
    validate: {
      notNull: {
        msg: i18n.__('errors.required_field', i18n.__('labels.address'))
      }
    }
  })
  address: string

  @Column({
    type: DataType.STRING,
  })
  description: string

  @Column({ type: DataType.STRING })
  imageUrl: string

  @CreatedAt
  createdAt: Date

  @UpdatedAt
  updatedAt: Date

  image: any
}
