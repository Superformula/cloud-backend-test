import { DataSource } from 'apollo-datasource';
import geo from '@mapbox/mapbox-sdk/services/geocoding';

export class GeoDataSource extends DataSource {

    private geoClient;
    constructor(){
        super();
        this.geoClient = geo({ accessToken: process.env.MAPBOX_ACCESS_TOKEN});
    }

    public async geocode(address: string) : Promise<any> {
        const result = await this.geoClient.forwardGeocode({
            query: address,
            mode: 'mapbox.places',
            limit: 3, // Top 3 results
            types: ['address'],
        })
        .send();

        return Promise.resolve(result.body.features.map(item => ({
            place: item.place_name,
            latitude: item.center[0],
            longitude: item.center[1]
        })));
    }
}