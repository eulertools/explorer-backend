import omit from 'lodash/omit';
import app from '../../src/app';
import notificationMock from '../../src/mocks/notification.json';
import userMock from '../../src/mocks/user.json';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'notifications' service", () => {
  let service: any;
  let createdItem: any;
  const internalKey = app.get('internalKey');

  beforeAll(() => {
    service = app.service('notifications');
  });

  beforeEach(() => {
    if (createdItem) {
      createdItem.user_sub = userMock.sub;
    }
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can create a notification', async () => {
    createdItem = await service.create(notificationMock, {
      internalKey,
      user: userMock,
    });

    expect(createdItem).toHaveProperty('identifier');
    expect(createdItem).toMatchObject(omit(notificationMock, ['identifier']));
  });

  it('can retrieve the notification', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    const notification = await service.get(
      parseIdentifier(createdItem.identifier)
    );

    expect(notification).toStrictEqual(createdItem);
  });

  it('can list notifications', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    const notifications = await service.find();

    expect(notifications).toContainEqual(createdItem);
  });

  it('can remove the notification', async () => {
    const notification = await service.remove(
      parseIdentifier(createdItem.identifier)
    );

    expect(notification).toHaveProperty('$metadata');
  });
});
