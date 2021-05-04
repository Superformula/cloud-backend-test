import { pubSub } from '@sf/api/config';
import { User } from '@sf/core/user';

export type PublishUserPayload = {
  user: User;
  event: 'created' | 'updated' | 'deleted';
};

export const PUBLISH_USER = 'PUBLISH_USER';

export const publishUser = (user: User, event: PublishUserPayload['event']): void => {
  const payload: PublishUserPayload = { user, event };
  pubSub.publish(PUBLISH_USER, payload);
};
