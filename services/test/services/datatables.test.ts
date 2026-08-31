import app from '../../src/app';

describe("'datatables' service", () => {
  it('registered the service', () => {
    const service = app.service('datatables');
    expect(service).toBeTruthy();
  });
});
