import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class UserService {
  private database: DocumentClient;

  private tableName: string;

  constructor(db: DocumentClient, tableName: string) {
    this.database = db;
    this.tableName = tableName;
  }
}
