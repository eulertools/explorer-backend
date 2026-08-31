import { Application } from '../../declarations';
import seed from '../../seeds/subscription_settings';
import { DynamoDataService } from '../dynamo_data_service';

export class SubscriptionSettings extends DynamoDataService {
  async setup(app: Application, path: string): Promise<void> {
    await super.setup(app, path);

    const internalKey = app.get('internalKey');

    // check if the subscriptions settings were initialized
    const subscriptionsSettings = await this.find({
      query: {},
      internalKey,
    });

    if (!subscriptionsSettings.length) {
      // let's create the initial subscription plans
      Promise.all(
        seed.map((settings: any) =>
          this.create(settings, {
            internalKey,
            user: {
              sub: 'system',
            },
          })
        )
      )
        .then((settings) => {
          app.set('subscription_settings', settings);
        })
        .catch(console.error);
    } else {
      app.set('subscription_settings', subscriptionsSettings);
    }
  }
}
