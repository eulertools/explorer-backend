import Joi from '@hapi/joi';
import 'joi-extract-type';

export enum SubscriptionStatus {
  PROCESSING = 'processing',
  CONFIRMED = 'confirmed',
  EXPIRED = 'expired',
  INVALID = 'invalid',
}

const schema = Joi.object({
  subscription: Joi.string().required(),
  status: Joi.string().valid(
    SubscriptionStatus.PROCESSING,
    SubscriptionStatus.CONFIRMED,
    SubscriptionStatus.EXPIRED,
    SubscriptionStatus.INVALID
  ),
  tx_hash: Joi.string().max(250),
  details: Joi.object(),
  expires_at: Joi.date(),
});

export type Subscription = Joi.extractType<typeof schema>;
export default schema;
