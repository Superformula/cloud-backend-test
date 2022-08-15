import { Logger } from "@aws-lambda-powertools/logger";
import {Client, Status} from "@googlemaps/google-maps-services-js";
import {DataSource} from 'apollo-datasource';
import { responsePathAsArray } from "graphql";
import { Service } from "typedi";
import config from "../configs/config";

@Service()
export class LocationService extends DataSource {
    constructor(private googleClient: Client, private logger: Logger){
        super();
    }

    public async getCoordinates(address: string) {
        this.logger.debug(`locationService.getCoordinates called with address: ${address}`);
        try {
            let params = {
                address: address,
                key: config.googleMapsKey!
            }; 
            
            this.logger.debug(`Sending request to googlde geocode api...`);

            var repsonse = await this.googleClient.geocode({params});

            this.logger.debug(`Got response from google geocode api...`);
            
            if(repsonse.status === 200 && repsonse.data.status == Status.OK && repsonse.data.results?.length > 0){
                const locationData = repsonse.data.results[0].geometry.location;

                this.logger.info(`Valid response from google geocode service: ${JSON.stringify(locationData)}`);
                
                return {
                    latitude: locationData.lat,
                    longitude: locationData.lng
                }
            }
            else{
                this.logger.error(`Location not found against address: ${address}`);
                
                return {
                    code: 'LOCATION_NOT_FOUND',
                    message: 'Unable to find coordinates for given address',
                }
            }
        } catch (error) {
            /* istanbul ignore next */ 
            this.logger.error(`locationService.getCoordinates ended up in exception. Error: ${error}`);
        }
        
    }
}