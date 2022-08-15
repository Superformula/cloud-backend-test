import { GraphQLScalarType } from "graphql";


export const NonEmptyString = new GraphQLScalarType({
    name: 'NonEmptyString',
    description: 'Non empty string',
    serialize: (value: unknown): string => {
      if (typeof value !== 'string') { 
        throw <Error>{message: 'Wrong value type', name: 'WRONG_VALUE_TYPE'};
      }
      if (value === '') { 
        throw <Error>{message: `Value can't be empty`, name: 'VALUE_NOT_EMPTY'};
      }
  
      return value
    },
    parseValue: (value: unknown): string => {
        if (typeof value !== 'string') { 
          throw <Error>{message: 'Wrong value type', name: 'WRONG_VALUE_TYPE'};
          }
        if (value === '') { 
          throw <Error>{message: `Value can't be empty`, name: 'VALUE_NOT_EMPTY'};
        }
      
      return value
    },
    
  });