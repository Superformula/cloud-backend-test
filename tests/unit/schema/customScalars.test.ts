import {NonEmptyString} from '../../../src/schema/customScalars';
describe('customScalars Unit Test', () => {
    describe('NonEmptyString.serialize', () => {
      test('Should return error for non-string value', async () => {
        try {
          var result = NonEmptyString.serialize(23);
        } catch (error: any) {
          expect(error.name).toStrictEqual("WRONG_VALUE_TYPE");
        }
      });

      test('Should return error for empty string value', async () => {
        try {
          var result = NonEmptyString.serialize('');
        } catch (error: any) {
          expect(error.name).toStrictEqual("VALUE_NOT_EMPTY");
        }
      });

      test('Should return value for valid and non-empty string value', async () => {
          var result = NonEmptyString.serialize('validString');
          expect(result).toStrictEqual('validString');
        
      });
      
    })

    describe('NonEmptyString.parseValue', () => {
      test('Should return error for non-string value', async () => {
        try {
          var result = NonEmptyString.parseValue(23);
        } catch (error: any) {
          expect(error.name).toStrictEqual("WRONG_VALUE_TYPE");
        }
      });

      test('Should return error for empty string value', async () => {
        try {
          var result = NonEmptyString.parseValue('');
        } catch (error: any) {
          expect(error.name).toStrictEqual("VALUE_NOT_EMPTY");
        }
      });

      test('Should return value for valid and non-empty string value', async () => {
          var result = NonEmptyString.parseValue('validString');
          expect(result).toStrictEqual('validString');
        
      });
      
    })
  })