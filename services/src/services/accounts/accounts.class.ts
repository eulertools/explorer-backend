import { NullableId, Params } from '@feathersjs/feathers';
import first from 'lodash/first';
import { SubscriptionStatus } from '../../models/subscriptions.model';
import {
  SubscriptionSettings,
  SubscriptionType,
} from '../../models/subscription_settings.model';
import { User } from '../../models/user.model';
import { DynamoDataService } from '../dynamo_data_service';

export class Accounts extends DynamoDataService {
  private getSubscriptionSettings(
    plan: SubscriptionType | null,
    id: string | null
  ): SubscriptionSettings | undefined {
    const settings: SubscriptionSettings[] = this.app.get(
      'subscription_settings'
    );
    const freeSubscription: SubscriptionSettings | undefined = settings.find(
      (setting: SubscriptionSettings) =>
        id ? setting.identifier === id : setting.name === plan
    );

    return freeSubscription;
  }

  /**
   * Create and return a default subscription for this user if one doesn't exist.
   *
   * @param  {User} user
   * @param  {string} internalKey
   * @returns Promise
   */
  private async getUserSubscription(
    user: User,
    internalKey: string
  ): Promise<any> {
    let userSubscription = first(
      await this.app.service('subscriptions').find({
        internalKey,
        user,
      })
    );

    if (!userSubscription) {
      const freeSubscription = this.getSubscriptionSettings(
        SubscriptionType.FREE,
        null
      );

      if (freeSubscription) {
        userSubscription = await this.app.service('subscriptions').create(
          {
            subscription: freeSubscription.identifier,
            status: SubscriptionStatus.CONFIRMED,
            details: {},
          },
          {
            user,
            internalKey,
          }
        );
      }
    }

    return userSubscription;
  }

  async create(data: any, params: Params | undefined): Promise<any> {
    const internalKey = params?.internalKey;
    let user: User = params?.user as User;

    if (!user) {
      user = { user_sub: data?.user_sub };
    }

    let account = first(
      await this.find({
        internalKey,
        user,
      })
    );

    await this.getUserSubscription(user, internalKey);

    // create a account if none exists
    if (!account) {
      account = await super.create(
        {
          user_sub: user.user_sub,
          identifier: data.identifier,
        },
        {
          user,
          internalKey,
        }
      );
    }

    return account;
  }

  async get(id: NullableId, params: Params): Promise<any> {
    const internalKey = this.app.get('internalKey');
    const user: User = params?.user as User;

    const userSubscription = await this.getUserSubscription(user, internalKey);

    const account = await this.create(
      {
        user_sub: user.user_sub,
      },
      { ...params, internalKey }
    );

    // const settings = this.app.get('subscription_settings');
    const { details, name } = this.getSubscriptionSettings(
      null,
      userSubscription.subscription
    ) as SubscriptionSettings;

    return {
      ...account,
      subscription: {
        ...params?.user_sub?.subscription.details,
        ...userSubscription,
        permissions: details,
        name
      },
    };
  }
}
