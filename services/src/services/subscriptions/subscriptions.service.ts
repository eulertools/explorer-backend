// Initializes the `subscriptions` service on path `/subscriptions`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Subscriptions } from './subscriptions.class';
import hooks from './subscriptions.hooks';
import settingsHooks from './subscription_settings.hooks';
import { SubscriptionSettings } from './subscription_settings.class';

export function subscriptions(app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: { userSubscriptions },
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    table: userSubscriptions,
    primaryKey: 'user_sub',
  };
  const subscriptions = new Subscriptions(options, app);

  app.use('/subscriptions', subscriptions);

  // Get our initialized service so that we can register hooks
  const service = app.service('subscriptions');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`subscriptions-${connection?.user?.user_sub}`).join(connection);
  });
}

export function subscription_settings(app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: { subscriptionsSettingsTable },
  } = app.get('dynamodb');
  const optionsSettings = {
    paginate: app.get('paginate'),
    table: subscriptionsSettingsTable,
    primaryKey: 'owner',
  };
  const subscriptionsSettings = new SubscriptionSettings(optionsSettings, app);

  app.use('/subscription_settings', subscriptionsSettings);

  // Get our initialized service so that we can register hooks
  const serviceSettings = app.service('subscription_settings');

  serviceSettings.hooks(settingsHooks);
}
