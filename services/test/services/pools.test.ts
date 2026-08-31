import app from '../../src/app';
import poolMock from '../../src/mocks/pool.json';

describe("'pools' service", () => {
  let service: any;
  const attrs = ['poolAddress', 'token1', 'token2'];

  beforeAll(() => {
    service = app.service('pools');
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can retrieve the pool', async () => {
    const pool = await service.get(poolMock.poolAddress);

    expect(pool?.poolAddress).toEqual(poolMock.poolAddress);
    expect(pool?.token1?.address).toEqual(poolMock.token1.address);
    expect(pool?.token2?.address).toEqual(poolMock.token2.address);
  });
});
