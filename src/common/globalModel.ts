import { ModelMetadata } from "./ModelMetadata"

enum ModelEnum {
    user = "user",
    anotherModel = "anotherModel"
}

const ModelMetadatas = {
    [ModelEnum.user]: new ModelMetadata(
        process.env.USER_DYNAMODB_TABLE || '',
        {
            id: "id",
            name: "dob",
            address: "address",
            description: "description",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            imageUrl: "imageUrl",
        }),
    [ModelEnum.anotherModel]: new ModelMetadata(
        process.env.OTHERMODEL_DYNAMODB_TABLE || '',
        {
            id: "id",
        }),
}


export {
    ModelEnum,
    ModelMetadatas
}