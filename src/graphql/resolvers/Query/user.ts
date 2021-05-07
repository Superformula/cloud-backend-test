import { ModelEnum } from "../../../common/globalModel";
import { GeoDataSource } from "../../dataSources/geo/GeoDataSource";
import { StorageDataSource } from "../../dataSources/storage/StorageDataSource";


export const user = {
    async users(parent: any, args: any, context: { dataSources: { storage: StorageDataSource}}, info: any) {
      return await context.dataSources.storage.read(ModelEnum.user, args);
    },
  
    async geolocate(parent: any, args: any, context: { dataSources: { geo: GeoDataSource}}, info: any) {
        return await context.dataSources.geo.geocode(args['address']);
    },
  }