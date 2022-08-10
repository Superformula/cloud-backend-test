export interface ICoordinate {
  latitude: number;
  longitude: number;
}

export interface IGeoCoder {
  getCoordinatesByAddress(address: string): Promise<ICoordinate>;
}
