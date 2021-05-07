import { ModelEnum } from "../../../common/globalModel";
import { StorageDataSource } from "../../dataSources/storage/StorageDataSource";


export const user = {
    async createUser(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.create(ModelEnum.user, args);
    },
  
    async updateUser(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.update(ModelEnum.user, args);
    },

    async deleteUser(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.delete(ModelEnum.user, args);
    },
  }