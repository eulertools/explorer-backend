import omit from 'lodash/omit';
import app from '../../src/app';
import userMock from '../../src/mocks/user.json';
import walletMock from '../../src/mocks/wallet.json';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'wallets' service", () => {
  let service: any;
  let createdItem: any;

  beforeAll(() => {
    service = app.service('wallets');
    jest.setTimeout(20000);
  });

  beforeEach(() => {
    if (createdItem) {
      createdItem.user_sub = userMock.user_sub;
    }
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can create a wallet', async () => {
    createdItem = await service.create(walletMock);

    expect(createdItem).toHaveProperty('identifier');
    expect(createdItem).toMatchObject(omit(walletMock, ['identifier']));
  });

  it('can retrieve the wallet', async () => {
    const wallet = await service.get(parseIdentifier(createdItem.address));

    expect(walletMock).not.toHaveProperty('totalBNB');
    expect(wallet).toHaveProperty('totalBNB');
  });

  it('can list wallets', async () => {
    const wallets = await service.find();
    expect(wallets).toContainEqual(createdItem);
  });

  it('can remove the wallet', async () => {
    const wallet = await service.remove(
      parseIdentifier(createdItem.identifier)
    );

    expect(wallet).toHaveProperty('$metadata');
  });
});
