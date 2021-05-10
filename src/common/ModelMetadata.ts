export class ModelMetadata {
    constructor(public tableName: string, public attributes: any){}

    public async getAttributesForScan(args: any) : Promise<any>{

        let ExclusiveStartKey, FilterExpression, Limit, ExpressionAttributeValues, ExpressionAttributeNames;
        
        if (args["id"]){
            ExpressionAttributeNames = {};
            ExpressionAttributeValues = {};

            FilterExpression = `#id = :hashKey`;
            ExpressionAttributeValues[':hashKey'] = args["id"];
            ExpressionAttributeNames[`#id`] = 'id';
        }
        else{
            Limit = args["limit"]? (args["limit"] > 0)? args["limit"] : 10 : undefined;

            if (args["lastEvaluatedKey"]){
                ExclusiveStartKey = { "id": args["lastEvaluatedKey"] };
            }

            delete args['limit'];
            delete args['lastEvaluatedKey'];

            if ( Object.keys(args).length > 0){
                let filterExp = [];
                ExpressionAttributeValues = {};
                ExpressionAttributeNames = {};

                Object.keys(args).forEach(key => {
                    filterExp.push(`contains(#${key}, :${key})`);
                    ExpressionAttributeValues[`:${key}`] = args[key];
                    ExpressionAttributeNames[`#${key}`] = key;
                });
                FilterExpression = filterExp.join(', ');
            }
        }
        
        
        const expression = {
            FilterExpression,
            ExpressionAttributeValues,
            ExpressionAttributeNames,
            Limit,
            ExclusiveStartKey
        };


        // console.log(expression);
        return Promise.resolve(expression);
    }

    public async getAttributesForInsert(args: any) : Promise<any>{

        const attr = Object.assign({}, args.attributes);
        const expression = Object.keys(attr)
            .reduce( (object, key) => {
                if (this.attributes[key]){
                    object[key] = attr[key];
                }
                return object;
            }, {});

        return Promise.resolve(expression);
    }

    public async getAttributesForUpdate(args: any) : Promise<any>{

        const attributes = Object.assign({}, args.attributes);
        const expression = Object.keys(attributes)
            .reduce( (object, key) => {
                if (this.attributes[key]){
                    object.updateExpression.push(`#${key} = :${key}`);
                    object.expressionAttributeValues[`:${key}`] = attributes[key];
                    object.expressionAttributeNames[`#${key}`] = key;
                }
                return object;
            }, {
                updateExpression: [],
                expressionAttributeValues: {},
                expressionAttributeNames:{}
            });

        return Promise.resolve({
            UpdateExpression: `set ${expression.updateExpression.join(', ')}`,
            ExpressionAttributeValues: expression.expressionAttributeValues,
            ExpressionAttributeNames: expression.expressionAttributeNames
        });

    }
}