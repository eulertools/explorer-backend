import {
  SubscriptionSettings,
  SubscriptionType,
} from '../models/subscription_settings.model';

const seed: SubscriptionSettings[] = [
  {
    name: SubscriptionType.FREE,
    active: true,
    details: {
      wallets: 1,
      portfolios: 1,
      portfolioEntities: 20,
      staking: {
        portfolios: 3,
        portfolioEntities: 50,
      },
      notifications: {
        wallet: false,
      },
      alerts: false,
    },
  },
  {
    name: SubscriptionType.ADVANCED,
    active: true,
    details: {
      wallets: 10 ** 10,
      portfolios: 10 ** 10,
      portfolioEntities: 10 ** 10,
      staking: {
        portfolios: 10 ** 10,
        portfolioEntities: 10 ** 10,
      },
      notifications: {
        wallet: false,
      },
      alerts: false,
    },
    price: {
      discount_threshold_eulers: 4000,
      usd_month: 149.99,
      usd_month_discounted: 99.99,
    },
  },
  {
    name: SubscriptionType.PRO,
    active: true,
    details: {
      wallets: 10 ** 10,
      portfolios: 10 ** 10,
      portfolioEntities: 10 ** 10,
      staking: {
        portfolios: 10 ** 10,
        portfolioEntities: 10 ** 10,
      },
      notifications: {
        wallet: true,
      },
      alerts: true,
    },
    price: {
      discount_threshold_eulers: 4000,
      usd_month: 449.99,
      usd_month_discounted: 299.99,
    },
  },
  {
    name: SubscriptionType.ENTERPRISE,
    active: true,
    details: {
      wallets: 10 ** 10,
      portfolios: 10 ** 10,
      portfolioEntities: 10 ** 10,
      staking: {
        portfolios: 10 ** 10,
        portfolioEntities: 10 ** 10,
      },
      notifications: {
        wallet: true,
      },
      alerts: true,
    },
  },
];

export default seed;
