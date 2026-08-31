import app from '../../src/app';
import pairMock from '../../src/mocks/pair.json';
import { pick } from 'lodash';

describe("'pairs' service", () => {
  let service: any;
  const attrs = ['address', 'identifier', 'symbol', 'base_token_address'];

  beforeAll(() => {
    service = app.service('pairs');
    jest.setTimeout(20000);
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can retrieve the pair', async () => {
    const { _source } = await service.get(pairMock.address);

    expect(pick(_source, attrs)).toMatchObject(pick(pairMock, attrs));
  });

  it('can find pairs', async () => {
    const pairs = await service.find({
      query: {
        size: 16,
        from: 0,
        owner: 'wswap',
        orderBy: 'quote_token_balance',
        orderDir: 'desc',
      },
    });

    expect(pairs).toHaveProperty('hits');
    expect(pairs).toHaveProperty('total');
    expect(pairs?.total?.value).toBeGreaterThan(0);
  });
});
