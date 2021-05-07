import { DataSource } from 'apollo-datasource';
import { ModelEnum, ModelMetadatas } from '../../../common/globalModel';
import { ModelMetadata } from '../../../common/ModelMetadata';
import { v1 as uuidv1 } from 'uuid'; 
import { dbClient } from './dynamodb';
import {
	PutItemInput,
	ScanInput,
	DocumentClient,
	ScanOutput,
} from 'aws-sdk/clients/dynamodb'
import AWS from 'aws-sdk';
import { ApolloError } from 'apollo-server-errors';

export class StorageDataSource extends DataSource {
    
    private db: AWS.DynamoDB.DocumentClient;
    constructor() {
        super();
        this.db = dbClient;
    }

    public async read(model: ModelEnum, args: any): Promise<any>{

      const modelMetadata = (ModelMetadatas[model] as ModelMetadata);
      let result: ScanOutput;
      let accumulated = [];
      let ExclusiveStartKey;

      const attributesForScan = await modelMetadata.getAttributesForScan(args);
      ExclusiveStartKey = attributesForScan['ExclusiveStartKey'];

      try{
        // Search by ID
        if (attributesForScan['FilterExpression']){
          const params: ScanInput = {
            TableName: modelMetadata.tableName,
            ... await modelMetadata.getAttributesForScan(args),
          };
          result = await this.db.scan(params).promise();
          accumulated = [...result.Items];

        }
        // Paginated list
        else {
          do {
            const params: ScanInput = {
              TableName: modelMetadata.tableName,
              Limit: attributesForScan['Limit'],
              ExclusiveStartKey
            };
            result = await this.db.scan(params).promise();

            ExclusiveStartKey = result.LastEvaluatedKey;
            accumulated = [...accumulated, ...result.Items];

          } while((accumulated.length < attributesForScan['Limit']) && (result.Items.length || result.LastEvaluatedKey))
        }

        return Promise.resolve({
          items: [...accumulated],
          count: result.Count,
          lastEvaluatedKey: result.LastEvaluatedKey? result.LastEvaluatedKey.id : undefined
        });

      }
      catch(ex){
        return Promise.reject(new ApolloError(ex));
      }
    }
    
    public async create(model: ModelEnum, args: any): Promise<any>{

      try{
        const modelMetadata = (ModelMetadatas[model] as ModelMetadata);
        const params: PutItemInput = {
            TableName: modelMetadata.tableName,
            Item: {
              id: uuidv1(),
              ... await modelMetadata.getAttributesForInsert(args)
            },
            ReturnValues: 'ALL_OLD'
          };

          await this.db.put(params).promise();
          return Promise.resolve(params.Item)

      }
      catch(ex){
        return Promise.reject(new ApolloError(ex));
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

        await this.db.delete(params).promise();
        return Promise.resolve(true);

      }
      catch(ex){
        return Promise.reject(new ApolloError("Document not found", "404"));
      }
    }
  
}