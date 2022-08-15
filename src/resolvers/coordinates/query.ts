export class CoordinatesQuery {
    public async getCoordinates(parent: any, args: any, {dataSources}: any, info: any){
        return await dataSources.locationService.getCoordinates(args.address);
    }
}