import { NullableId, Params } from '@feathersjs/feathers';
import axios from 'axios';
import first from 'lodash/first';
import {
  Subscription,
  SubscriptionStatus,
} from '../../models/subscriptions.model';
import { DynamoDataService } from '../dynamo_data_service';
import { SubscriptionSettings } from '../../models/subscription_settings.model';

type SubscriptionDTO = Subscription & { identifier: string; user_sub: string };

export class Subscriptions extends DynamoDataService {
  async update(
    id: NullableId,
    data: any,
    params: Params | undefined
  ): Promise<any> {
    // unless there is a payment ongoing, reject updates
    if (!data.tx_hash) {
      return false;
    } else if (!params?.internalKey && data.tx_hash) {
      // a payment is underway, set this as a pending subscription
      return await this.switchSubscriptionStatus(
        { ...data, identifier: id, user_sub: params?.user?.user_sub },
        SubscriptionStatus.PROCESSING
      );
    }

    return super.update(id, data, params);
  }

  async processTransaction(
    data: any,
    params: Params | undefined
  ): Promise<boolean> {
    let processed = false;
    const { hash, from_address, value: amount } = data;

    if (hash) {
      try {
        // is the transaction associated with a pending subscription?
        const results = await this.find({
          ...params,
          query: {
            tx_hash: hash,
          },
        });
        const subscription: any | undefined = first(results);
        const isValidSubscriptionRequest =
          await this.validatesSubscriptionRequest(
            subscription,
            amount,
            from_address
          );

        if (isValidSubscriptionRequest) {
          await this.switchSubscriptionStatus(
            subscription,
            SubscriptionStatus.CONFIRMED
          );

          // flag this transaction
          processed = true;
        }
      } catch (err) {
        console.error(err);
      }
    }

    return processed;
  }

  async switchSubscriptionStatus(
    subscription: SubscriptionDTO,
    status: SubscriptionStatus
  ): Promise<Subscription> {
    const internalKey = this.app.get('internalKey');
    const updated = await this.update(
      subscription.identifier,
      {
        tx_hash: subscription.tx_hash,
        subscription: subscription.subscription,
        status,
      },
      {
        user: { sub: subscription.user_sub },
        internalKey,
      }
    );

    // notify user
    const notification = {
      item_ref: subscription.identifier,
      item_type: 'subscription',
      item_msg: { text: `subscription_${status}` },
      item_read: false,
    };

    const notified = await this.app
      .service('notifications')
      .create(notification, {
        internalKey,
        user: { sub: subscription.user_sub },
      });

    return subscription;
  }

  /**
   * Validates a subscription request using different criteria.
   *
   * @param  {SubscriptionDTO} subscription The requested subscription
   * @param  {string} amount The amount paid
   * @param  {string} address The origin of the payment
   * @returns {Promise} true if subscription is valid, false otherwise.
   */
  async validatesSubscriptionRequest(
    subscription: SubscriptionDTO | undefined,
    amount: string,
    address: string
  ): Promise<boolean> {
    if (subscription?.identifier) {
      const internalKey = this.app.get('internalKey');
      const plans: any[] = await this.app.get('subscription_settings');
      const requestedPlan: SubscriptionSettings | undefined = plans.find(
        (plan) => plan.identifier === subscription.subscription
      );

      // return latest prices
      const {
        data: { euler: eulerPrice = 0 },
      } = await axios.get('https://catalog.prod.euler.tools/prices');

      // retrieve address' staking info
      const { userInfo } = await (
        this.app.service('stacking') as DynamoDataService
      ).get(address, {
        internalKey,
        query: {},
      });

      // setup final price
      const stakedAmount = Number(userInfo?.amount) / 1e18;
      const eulersRequired =
        requestedPlan?.price?.discount_threshold_eulers || null;
      let finalPrice = requestedPlan?.price?.usd_month;

      if (eulersRequired && stakedAmount >= eulersRequired) {
        // user has staking, hence the discount applies
        finalPrice = requestedPlan?.price?.usd_month_discounted;
      }

      // check if paid amount is sufficient
      const amountPaid = Number(amount) / 1e18;
      const amountUsd = amountPaid / eulerPrice;

      if (finalPrice && amountUsd >= finalPrice) {
        // all good
        return true;
      } else {
        await this.switchSubscriptionStatus(
          subscription,
          SubscriptionStatus.INVALID
        );
      }
    }

    return false;
  }
}
