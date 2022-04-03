import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { User } from '../graphql/types/types';

/**
 * This mapper would convert an AttributeMap to a User type object
 * @param attrs Attribute map
 * @returns A user object.
 */
export function mapAttributeToUser(attrs: AttributeMap): User {
  return {
    id: attrs.id as string,
    name: attrs.name as string,
    dob: attrs.dob as string,
    address: attrs.address as string,
    description: attrs.description as string,
    createdAt: attrs.createdAt as string,
    updatedAt: attrs.updatedAt as string,
    imageUrl: attrs.imageUrl as string,
  };
}
