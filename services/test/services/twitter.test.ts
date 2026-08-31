import app from '../../src/app';

describe("'twitter' service", () => {
  let service: any;

  beforeAll(() => {
    service = app.service('twitter');
    jest.setTimeout(20000);
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can retrieve some tweets', async () => {
    const tweets = await service.find({
      query: {
        token: 'BTC',
        account: 'EulerTools',
      },
    });

    expect(tweets).toBeInstanceOf(Array);
    expect(tweets).toContainEqual(expect.anything());
  });

  it('can retrieve at least 5 tweets from a timeline', async () => {
    const tweets = await service.get('EulerTools', {
      query: {
        count: 5,
      },
    });

    expect(tweets).toBeInstanceOf(Array);
    expect(tweets).toHaveLength(5);
    expect(tweets).toContainEqual(expect.anything());
  });
});
