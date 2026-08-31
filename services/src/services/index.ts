import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../declarations';
import { Accounts } from './accounts/accounts.class';
import accounts from './accounts/accounts.service';
import { Addresses } from './addresses/addresses.class';
import addresses from './addresses/addresses.service';
import { Alerts } from './alerts/alerts.class';
import alerts from './alerts/alerts.service';
import { Blocks } from './blocks/blocks.class';
import blocks from './blocks/blocks.service';
import { Datatables } from './datatables/datatables.class';
import datatables from './datatables/datatables.service';
import { Favorites } from './favorites/favorites.class';
import favorites from './favorites/favorites.service';
import { Logs } from './logs/logs.class';
import logs from './logs/logs.service';
import { Medium } from './medium/medium.class';
import medium from './medium/medium.service';
import { Notifications } from './notifications/notifications.class';
import notifications from './notifications/notifications.service';
import { Marketplace } from './marketplace/marketplace.class';
import marketplace from './marketplace/marketplace.service';
import { Pairs } from './pairs/pairs.class';
import pairs from './pairs/pairs.service';
import { Pools } from './pools/pools.class';
import pools from './pools/pools.service';
import { Portfolios } from './portfolios/portfolios.class';
import portfolios from './portfolios/portfolios.service';
import { Profiles } from './profiles/profiles.class';
import profiles from './profiles/profiles.service';
import { Search } from './search/search.class';
import search from './search/search.service';
import { Subscriptions } from './subscriptions/subscriptions.class';
import {
  subscriptions,
  subscription_settings,
} from './subscriptions/subscriptions.service';
import { SubscriptionSettings } from './subscriptions/subscription_settings.class';
import { Tokens } from './tokens/tokens.class';
import { TokensSecurity } from './tokens/tokens_security.class'
import {
  tokens,
  tokens_security,
} from './tokens/tokens.service';
import { TokenTransfers } from './token_transfers/token_transfers.class';
import token_transfers from './token_transfers/token_transfers.service';
import { BscTransactions } from './transactions/bsc_transactions.class';
import { Transactions } from './transactions/transactions.class';
import {
  bsc_transactions,
  transactions,
} from './transactions/transactions.service';
import { Twitter } from './twitter/twitter.class';
import twitter from './twitter/twitter.service';
import { Voting } from './voting/voting.class';
import voting from './voting/voting.service';
import { Wallets } from './wallets/wallets.class';
import wallets from './wallets/wallets.service';
import { Trades } from './trades/trades.class';
import trades from './trades/trades.service';

import dexrouter from './dexrouter/dexrouter.service';

import { Settings } from './settings/settings.class';
import settings from './settings/settings.service';

import { Staking } from './staking/staking.class';
import staking from './staking/staking.service';

import { Gas } from './gas/gas.class';
import gas from './gas/gas.service';

declare module '../declarations' {
  interface ServiceTypes {
    accounts: Accounts & ServiceAddons<any>;
    addresses: Addresses & ServiceAddons<any>;
    alerts: Alerts & ServiceAddons<any>;
    blocks: Blocks & ServiceAddons<any>;
    bsc_transactions: BscTransactions & ServiceAddons<any>;
    datatables: Datatables & ServiceAddons<any>;
    favorites: Favorites & ServiceAddons<any>;
    gas: Gas & ServiceAddons<any>;
    logs: Logs & ServiceAddons<any>;
    marketplace: Marketplace & ServiceAddons<any>;
    medium: Medium & ServiceAddons<any>;
    notifications: Notifications & ServiceAddons<any>;
    pairs: Pairs & ServiceAddons<any>;
    pools: Pools & ServiceAddons<any>;
    portfolios: Portfolios & ServiceAddons<any>;
    profiles: Profiles & ServiceAddons<any>;
    search: Search & ServiceAddons<any>;
    settings: Settings & ServiceAddons<any>;
    staking: Staking & ServiceAddons<any>;
    subscription_settings: SubscriptionSettings & ServiceAddons<any>;
    subscriptions: Subscriptions & ServiceAddons<any>;
    token_transfers: TokenTransfers & ServiceAddons<any>;
    tokens: Tokens & ServiceAddons<any>;
    tokens_security: TokensSecurity & ServiceAddons<any>;
    trades: Trades & ServiceAddons<any>;
    transactions: Transactions & ServiceAddons<any>;
    twitter: Twitter & ServiceAddons<any>;
    voting: Voting & ServiceAddons<any>;
    wallets: Wallets & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  app.configure(accounts);
  app.configure(addresses);
  app.configure(alerts);
  app.configure(blocks);
  app.configure(bsc_transactions);
  app.configure(datatables);
  app.configure(dexrouter);
  app.configure(favorites);
  app.configure(gas);
  app.configure(logs);
  app.configure(marketplace);
  app.configure(medium);
  app.configure(notifications);
  app.configure(pairs);
  app.configure(pools);
  app.configure(portfolios);
  app.configure(profiles);
  app.configure(search);
  app.configure(settings);
  app.configure(staking);
  app.configure(subscription_settings);
  app.configure(subscriptions);
  app.configure(token_transfers);
  app.configure(tokens);
  app.configure(tokens_security);
  app.configure(trades);
  app.configure(transactions);
  app.configure(twitter);
  app.configure(voting);
  app.configure(wallets);
}
