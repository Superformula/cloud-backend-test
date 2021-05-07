export class ModelMetadata {
    constructor(public tableName: string, public attributes: any){}

    public async getAttributesForInsert(args: any) : Promise<any>{

        const attrbutes = Object.assign({}, args.attributes);
        const attrubutes = Object.keys(attrbutes)
            .reduce( (object, key) => {
                if (this.attributes[key]){
                    object[key] = attrbutes[key];
                }
                return object
            }, {});

        return Promise.resolve(attrubutes);

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

        console.log(expression);
        return Promise.resolve(expression);

    }
}