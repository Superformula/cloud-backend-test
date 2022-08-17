import { getCoordinates } from './calculateCoordinates';
import conf from '../conf';
import { DataSource } from 'apollo-datasource';
import log from 'lambda-log';

export default class Coordinates extends DataSource {
  constructor() {
    super();
  }

  async getCoordinates(addressName: string) {
    const address = await getCoordinates(addressName, conf.apiKey);
    log.info(`address in getCoordinates in data source: ${address}`);
    return {
      address: address[0],
    };
  }
}
