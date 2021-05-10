import { DataSource } from 'apollo-datasource';
import { ModelEnum, ModelMetadatas } from '../../../common/globalModel';
import { ModelMetadata } from '../../../common/ModelMetadata';
import * as uuid from 'uuid';
import { dbClient as dynamobClient } from './dynamodb';
import { PutItemInput, ScanInput, DocumentClient, ScanOutput } from 'aws-sdk/clients/dynamodb'
import AWS from 'aws-sdk';
import { ApolloError } from 'apollo-server-errors';

export class StorageDataSource extends DataSource {
    
    private db: AWS.DynamoDB.DocumentClient;
    constructor(dbClient?) {
        super();
        this.db = dbClient? dbClient : dynamobClient;
    }

   public async getNewId() : Promise<string> {
      return uuid.v1();

   }

    public async read(model: ModelEnum, args: any): Promise<any>{

      const modelMetadata = (ModelMetadatas[model] as ModelMetadata);
      let result: ScanOutput;
      let accumulated = [];
      let { FilterExpression, ExpressionAttributeValues, Limit, ExclusiveStartKey, ExpressionAttributeNames } = await modelMetadata.getAttributesForScan(args);

      try{
        do {
          const params: ScanInput = {
            TableName: modelMetadata.tableName,
            FilterExpression,
            ExpressionAttributeValues,
            Limit,
            ExclusiveStartKey,
            ExpressionAttributeNames
          };
          result = await this.db.scan(params).promise();

          ExclusiveStartKey = result.LastEvaluatedKey;
          accumulated = [...accumulated, ...result.Items];

          
        } while((FilterExpression && !FilterExpression['id'])
            && accumulated.length < Limit
            && (result.Items.length > 0  && ExclusiveStartKey !== undefined ))

        // remove the exceeding items and adjusting the lastEvaluatedKey
        let itemsMatches = [...accumulated];
        let lastEvaluatedKey = result.LastEvaluatedKey? result.LastEvaluatedKey.id : undefined;
        if (accumulated.length > 0 && accumulated.length > Limit){
          itemsMatches = [...accumulated.slice(0, Limit)];
          lastEvaluatedKey = itemsMatches[itemsMatches.length - 1]['id'];
        }
        

        return Promise.resolve({
          items: itemsMatches,
          count: result.Count,
          lastEvaluatedKey: lastEvaluatedKey
        });

      }
      catch(ex){
        return Promise.reject(new ApolloError(ex.message));
      }
    }
    
    public async create(model: ModelEnum, args: any): Promise<any>{

      try{
        const modelMetadata = (ModelMetadatas[model] as ModelMetadata);
        const params: PutItemInput = {
            TableName: modelMetadata.tableName,
            Item: {
              id: await this.getNewId(),
              ... await modelMetadata.getAttributesForInsert(args)
            },
            ReturnValues: 'ALL_OLD'
          };

          await this.db.put(params).promise();
          return Promise.resolve(params.Item)

      }
      catch(ex){
        return Promise.reject(new ApolloError(ex.message));
      }
    }

    public async update(model: ModelEnum, args: any) : Promise<any>{
      
      try{
        const modelMetadata = (ModelMetadatas[model] as ModelMetadata);
        const params: DocumentClient.UpdateItemInput = {
            TableName: modelMetadata.tableName,
            Key: {
              id: args['id']
            },
            ... await modelMetadata.getAttributesForUpdate(args),
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: "ALL_NEW"
          };

        const updatedItem = await this.db.update(params).promise();
        return Promise.resolve(updatedItem.Attributes);

      }
      catch(ex){
        return Promise.reject(new ApolloError("Document not found", "404"));
      }
    }

    public async delete(model: ModelEnum, args: any): Promise<boolean> {
      
      try{
        const modelMetadata = (ModelMetadatas[model] as ModelMetadata);
        const params: DocumentClient.DeleteItemInput = {
            TableName: modelMetadata.tableName,
            Key: {
              id: args['id'],
            },
            ConditionExpression: 'attribute_exists(id)',
          };

        const result = await this.db.delete(params).promise();
        return Promise.resolve(true);

      }
      catch(ex){
        return Promise.reject(new ApolloError("Document not found", "404"));
      }
    }
  
}