import { pubSub } from '@sf/api/config';
import { User } from '@sf/core/user';
import { publishUser, PUBLISH_USER } from '../user';

jest.mock('aws-lambda-graphql');

const user: User = {
  id: '7dccdfde-ba9b-4ee5-92c7-c186c21c8543',
  address: 'Zboncak Cliff, East Ritamouth, 73326',
  description: 'Description 1',
  name: 'Elliot Breitenberg',
  dob: '2017-11-02T05:09:39.187Z',
  imageUrl: 'https://i.pravatar.cc/150?u=Elliot+Breitenberg',
  createdAt: '2020-03-22T16:12:01.496Z',
  updatedAt: '2020-07-04T04:42:43.636Z'
};

describe('publishUser', () => {
  beforeEach(() => {
    pubSub.publish = jest.fn();
  });

  it('publishes user event to pubSub', () => {
    publishUser(user, 'created');
    expect(pubSub.publish).toBeCalledWith(PUBLISH_USER, { user, event: 'created' });
    publishUser(user, 'updated');
    expect(pubSub.publish).toBeCalledWith(PUBLISH_USER, { user, event: 'updated' });
    publishUser(user, 'deleted');
    expect(pubSub.publish).toBeCalledWith(PUBLISH_USER, { user, event: 'deleted' });
  });
});
