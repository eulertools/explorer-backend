import app from '../../src/app';

describe("'trades' service", () => {
  it('registered the service', () => {
    const service = app.service('trades');
    expect(service).toBeTruthy();
  });
});
