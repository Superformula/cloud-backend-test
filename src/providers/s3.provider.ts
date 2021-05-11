import {
  IFile,
  IStorageProvider,
  IFileResponse
} from './interfaces/storage.interface'
import AWS, { S3 } from 'aws-sdk'
import s3config from '@/config/s3'
import { v4 as uuid } from 'uuid'
import { PutObjectRequest } from 'aws-sdk/clients/s3'
import { Stream } from 'stream'

export class S3Provider implements IStorageProvider {
  private s3bucket: S3
  private bucket: string = s3config.params.Bucket

  constructor() {
    this.s3bucket = new AWS.S3(s3config)
  }

  async get(key): Promise<Stream> {
    try {
      const params = {
        Key: key,
        Bucket: this.bucket
      }

      // check if the requested object exists
      await this.s3bucket.headObject(params).promise()

      // return stream
      return this.s3bucket.getObject(params).createReadStream()
    } catch (e) {
      throw e
    }
  }

  async upload(file: IFile): Promise<IFileResponse> {
    try {
      const key = `${uuid()}${file.filename}`

      const params: PutObjectRequest = {
        Key: key,
        Body: file.stream,
        ContentType: file.mimetype,
        Bucket: this.bucket
      }

      // returns Location (full url) and Key
      const { Key } = await this.s3bucket.upload(params).promise()

      const url = new URL(`/media/${Key}`, process.env.API_URL)

      return { uri: url.toString() }
    } catch (e) {
      throw e
    }
  }

  async delete(uri: string): Promise<void> {
    try {
      const key = uri.split('/')?.pop()

      const deleteRequest: AWS.S3.DeleteObjectRequest = {
        Key: key!,
        Bucket: this.bucket
      }

      await this.s3bucket.deleteObject(deleteRequest).promise()
    } catch (e) {
      throw e
    }
  }
}
