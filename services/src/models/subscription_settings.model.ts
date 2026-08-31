import Joi from '@hapi/joi';
import 'joi-extract-type';

export enum SubscriptionType {
  FREE = 'free',
  ADVANCED = 'advanced',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

const notificationsSchema = Joi.object({
  wallet: Joi.boolean().required().default(false),
});
const stakingSchema = Joi.object({
  portfolios: Joi.number().required(),
  portfolioEntities: Joi.number().required(),
});
const detailsSchema = Joi.object({
  wallets: Joi.number().required(),
  portfolios: Joi.number().required(),
  portfolioEntities: Joi.number().required(),
  staking: stakingSchema,
  notifications: notificationsSchema,
  alerts: Joi.boolean().required().default(false),
});
const priceSchema = Joi.object({
  usd_month: Joi.number(),
  usd_month_discounted: Joi.number(),
  discount_threshold_eulers: Joi.number(),
});
const schema = Joi.object({
  identifier: Joi.string(),
  name: Joi.string().valid(
    SubscriptionType.FREE,
    SubscriptionType.ADVANCED,
    SubscriptionType.PRO,
    SubscriptionType.ENTERPRISE
  ),
  active: Joi.boolean().default(true),
  details: detailsSchema,
  price: priceSchema,
});

export type SubscriptionSettingsNotifications = Joi.extractType<
  typeof notificationsSchema
>;
export type SubscriptionSettingsStaking = Joi.extractType<typeof stakingSchema>;
export type SubscriptionSettingsDetails = Joi.extractType<typeof detailsSchema>;
export type SubscriptionSettings = Joi.extractType<typeof schema>;
export default schema;
