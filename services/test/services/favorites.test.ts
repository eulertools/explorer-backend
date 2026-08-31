import app from '../../src/app';
import favoriteMock from '../../src/mocks/favorite.json';
import userMock from '../../src/mocks/user.json';
import { pick } from 'lodash';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'favorites' service", () => {
  let service: any;
  let createdItem: any;

  beforeAll(() => {
    service = app.service('favorites');
  });

  beforeEach(() => {
    if (createdItem) {
      createdItem.user_sub = userMock.user_sub;
    }
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can create a favorite', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    createdItem = await service.create(favoriteMock);

    expect(createdItem).toHaveProperty('identifier');
    expect(pick(createdItem, compareAttrs)).toEqual(
      pick(favoriteMock, compareAttrs)
    );
  });

  it('can retrieve the favorite', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    const favorite = await service.get(parseIdentifier(createdItem.identifier));

    expect(favorite).toStrictEqual(createdItem);
  });

  it('can list favorites', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    const favorites = await service.find();

    expect(favorites).toContainEqual(createdItem);
  });

  it('can remove the favorite', async () => {
    const favorite = await service.remove(
      parseIdentifier(createdItem.identifier)
    );

    expect(favorite).toHaveProperty('$metadata');
  });
});
