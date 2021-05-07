export class ModelMetadata {
    constructor(public tableName: string, public attributes: any){}

    public async getAttributesForScan(args: any) : Promise<any>{

        let ExclusiveStartKey, FilterExpression, Limit, ExpressionAttributeValues;
        
        if (args["id"]){
            FilterExpression = `id = :hashKey`;
            ExpressionAttributeValues = {
                ':hashKey': args["id"]
            }
        }
        else{
            Limit = args["limit"] || 10; //Default to 10 items

            if (args["lastEvaluatedKey"]){
                ExclusiveStartKey = { "id": args["lastEvaluatedKey"] };
            }
        }
        
        
        const expression = {
            FilterExpression,
            ExpressionAttributeValues,
            Limit,
            ExclusiveStartKey
        };

        console.log(expression);
        return Promise.resolve(expression);
    }

    public async getAttributesForInsert(args: any) : Promise<any>{

        const attrbutes = Object.assign({}, args.attributes);
        const expression = Object.keys(attrbutes)
            .reduce( (object, key) => {
                if (this.attributes[key]){
                    object[key] = attrbutes[key];
                }
                return object
            }, {});

        return Promise.resolve(expression);

    }

    public async getAttributesForUpdate(args: any) : Promise<any>{

        const attributes = Object.assign({}, args.attributes);
        const expression = Object.keys(attributes)
            .reduce( (object, key) => {
                if (this.attributes[key]){
                    object.UpdateExpression = object.UpdateExpression.concat(` #${key} = :${key}`);
                    object.ExpressionAttributeValues[`:${key}`] = attributes[key];
                    object.ExpressionAttributeNames[`#${key}`] = key;
                }
                return object;
            }, {
                UpdateExpression: "set",
                ExpressionAttributeValues: {},
                ExpressionAttributeNames:{}
            });

        return Promise.resolve(expression);

    }
}