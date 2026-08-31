import app from '../../src/app';
import { SubscriptionStatus } from '../../src/models/subscriptions.model';
import {
  SubscriptionSettings,
  SubscriptionType,
} from '../../src/models/subscription_settings.model';
import userMock from '../../src/mocks/user.json';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'profiles' & 'subscriptions' service", () => {
  let service: any;
  let serviceSettings: any;
  let profile: any;
  let subscription: any;
  let plans: SubscriptionSettings[];
  const params = {
    user: userMock,
    internalKey: app.get('internalKey'),
  };

  beforeAll(() => {
    service = app.service('profiles');
    serviceSettings = app.service('subscription_settings');

    serviceSettings.setup(app, 'subscription_settings');
  });

  it('registered the services', () => {
    expect(service).toBeTruthy();
    expect(serviceSettings).toBeTruthy();
  });

  it('can list subscription settings', async () => {
    plans = await serviceSettings.find();

    expect(plans).toHaveLength(4);
  });

  it('can retrieve own profile', async () => {
    profile = await service.get('me', params);

    expect(profile).toHaveProperty('identifier');
    expect(profile).toHaveProperty('subscription');
  });

  it('has an initial FREE subscription', async () => {
    subscription = await app
      .service('subscriptions')
      .get(profile.subscription.identifier, params);

    expect(subscription).toHaveProperty('subscription');

    const settings: SubscriptionSettings | undefined = plans.find(
      (plan: SubscriptionSettings) =>
        plan.identifier === subscription.subscription
    );

    expect(settings?.name).toEqual(SubscriptionType.FREE);
    expect(subscription.status).toEqual(SubscriptionStatus.CONFIRMED);
  });

  it('can remove the profile', async () => {
    const removed = await service.remove(
      parseIdentifier(profile.identifier),
      params
    );

    expect(removed).toHaveProperty('$metadata');
  });

  it("can remove the user's subscription", async () => {
    const removed = await app
      .service('subscriptions')
      .remove(parseIdentifier(subscription.identifier), params);

    expect(removed).toHaveProperty('$metadata');
  });
});
