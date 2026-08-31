import app from '../../src/app';
import { pick } from 'lodash';

describe("'medium' service", () => {
  let service: any;

  beforeAll(() => {
    service = app.service('medium');
    jest.setTimeout(20000);
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can retrieve euler.tools posts', async () => {
    const tweets = await service.find({
      query: {
        profile: 'euler.tools',
      },
    });

    expect(tweets).toBeInstanceOf(Array);
    expect(tweets).toContainEqual(expect.anything());
  });
});
