import subscription, { Subscription } from './subscriptions.model';
import Joi from '@hapi/joi';
import 'joi-extract-type';

const schema = Joi.object({
  username: Joi.string(),
  user_sub: Joi.string().required(),
  scope: Joi.string(),
  sub: Joi.string(),
  address: Joi.string(),
  subscription: subscription,
});

export type User = Joi.extractType<typeof schema>;
export default schema;
