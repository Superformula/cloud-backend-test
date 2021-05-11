import { ReadStream } from 'fs'
import { Stream } from 'stream'

export interface IFile {
  stream: ReadStream | Buffer
  filename: string
  mimetype: string
}

export interface IFileResponse {
  uri: string
}

export interface IStorageProvider {
  upload(file: IFile): Promise<IFileResponse>
  delete(key: string): Promise<void>
  get(key: string): Promise<Stream>
}
