import omit from 'lodash/omit';
import app from '../../src/app';
import alertMock from '../../src/mocks/alert.json';
import userMock from '../../src/mocks/user.json';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'alerts' service", () => {
  let service: any;
  let createdItem: any;

  beforeAll(() => {
    service = app.service('alerts');
  });

  beforeEach(() => {
    if (createdItem) {
      createdItem.user_sub = userMock.user_sub;
    }
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can create an alert', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    createdItem = await service.create(alertMock);

    expect(createdItem).toHaveProperty('identifier');
    expect(createdItem).toMatchObject(omit(alertMock, ['identifier']));
  });

  it('can retrieve the alert', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    const alert = await service.get(parseIdentifier(createdItem.identifier));

    expect(alert).toStrictEqual(createdItem);
  });

  it('can list alerts', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    const alerts = await service.find();

    expect(alerts).toContainEqual(createdItem);
  });

  it('can remove the alert', async () => {
    const alert = await service.remove(parseIdentifier(createdItem.identifier));

    expect(alert).toHaveProperty('$metadata');
  });
});
