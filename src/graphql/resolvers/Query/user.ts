import { ModelEnum } from "../../../common/globalModel";
import { StorageDataSource } from "../../dataSources/storage/StorageDataSource";


export const user = {
    async users(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.read(ModelEnum.user, args);
    },
  
    async geolocate(parent: any, args: any, context: any, info: any) {
      
  
        return Promise.resolve([{}]);
    },
  }