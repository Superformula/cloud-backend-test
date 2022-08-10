import { NonEmptyString } from '../schema/customScalars';
import { CoordinatesQuery } from './coordinates/query';

const CoordinatesOrError = {
    __resolveType(obj: any){
        return obj.code ?
         'Error' :
         'Coordinates';
    }
}

const Query = new CoordinatesQuery();

export const resolvers = {
    NonEmptyString: NonEmptyString,

    Query,
    CoordinatesOrError
}

