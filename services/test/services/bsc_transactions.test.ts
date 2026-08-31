import { KinesisClient, PutRecordsCommand } from '@aws-sdk/client-kinesis';
import app from '../../src/app';
import bscTransactionMock from '../../src/mocks/bsc_transaction.json';
import userMock from '../../src/mocks/user.json';
import { parseIdentifier } from '../../src/utils/dynamo_utils';
import pick from 'lodash/pick';
import {
  SubscriptionSettings,
  SubscriptionType,
} from '../../src/models/subscription_settings.model';
import {
  Subscription,
  SubscriptionStatus,
} from '../../src/models/subscriptions.model';
import { zip } from 'lodash';

describe('bsc_transactions', () => {
  const { region } = app.get('aws_config');
  const { bscTransactionsStream } = app.get('kinesis');
  const params = {
    user: userMock,
    internalKey: app.get('internalKey'),
  };
  let service: any;
  let profileService: any;
  let subscriptionService: any;
  let createdItem: any;
  let kinesisClient: any;
  let profile: any;

  beforeAll(() => {
    const serviceSettings = app.service('subscription_settings');
    service = app.service('bsc_transactions');
    profileService = app.service('accounts');
    subscriptionService = app.service('subscriptions');
    kinesisClient = new KinesisClient({ region });

    serviceSettings.setup(app, 'subscription_settings');

    jest.setTimeout(20000);
  });

  it('initalized kinesis client and bsc_transactions service', () => {
    expect(kinesisClient).toBeTruthy();
    expect(service).toBeTruthy();
  });

  it('loads up a test profile w/subscription', async () => {
    profile = await profileService.get('me', params);
    
    expect(profile).toHaveProperty('identifier');
    expect(profile).toHaveProperty('subscription');
  });

  it('emulates a transaction via kinesis', async () => {
    const response = await kinesisClient.send(
      new PutRecordsCommand({
        Records: [
          {
            Data: Buffer.from(JSON.stringify(bscTransactionMock)),
            PartitionKey: 'TRANSACTIONS',
          },
        ],
        StreamName: bscTransactionsStream,
      })
    );

    expect(response).toHaveProperty('$metadata');
    expect(response.$metadata?.httpStatusCode).toEqual(200);
  });

  it('sets up a subscription request', async () => {
    const plans: any[] = await app.get('subscription_settings');
    const free: any = plans.find((plan) => plan.identifier === SubscriptionType.FREE);
    const subscription = await subscriptionService.update(
      profile.subscription.identifier,
      {
        tx_hash: bscTransactionMock.hash,
        subscription: free.identifier,
        status: SubscriptionStatus.PROCESSING,
      },
      params
    );

    expect(subscription).toBeDefined();
    expect(subscription.status).toEqual(SubscriptionStatus.PROCESSING);
  });

  it('has properly processed the transaction', async () => {
    const transactions: any = await new Promise((resolve, reject) => {
      // wait few seconds until the SQS queue has been processed
      setTimeout(async () => {
        try {
          const transactions = await service.find({
            query: {
              from_address: bscTransactionMock.from_address,
              block_hash: bscTransactionMock.blockHash,
            },
          });
          resolve(transactions);
        } catch (err) {
          reject(err);
        }
      }, 4000);
    });

    if(transactions.length > 0) createdItem = transactions[0];
  });

  it('can remove the transaction', async () => {
  
    const removed = await service.remove(
      parseIdentifier(createdItem),
      { ...params, user: { sub: createdItem.user_sub } }
    );

    expect(removed).toHaveProperty('$metadata');
  });
});
