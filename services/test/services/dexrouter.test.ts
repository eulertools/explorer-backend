import app from '../../src/app';

describe('\'dexrouter\' service', () => {
  it('registered the service', () => {
    const service = app.service('dexrouter');
    expect(service).toBeTruthy();
  });
});
