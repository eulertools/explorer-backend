import omit from 'lodash/omit';
import app from '../../src/app';
import portfolioMock from '../../src/mocks/portfolio.json';
import userMock from '../../src/mocks/user.json';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'portfolios' service", () => {
  let service: any;
  let createdItem: any;

  beforeAll(() => {
    service = app.service('portfolios');
  });

  beforeEach(() => {
    if (createdItem) {
      createdItem.user_sub = userMock.sub;
    }
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can create a portfolio', async () => {
    createdItem = await service.create(portfolioMock);

    expect(createdItem).toHaveProperty('identifier');
    expect(createdItem).toMatchObject(omit(portfolioMock, ['identifier']));
  });

  it('can retrieve the portfolio', async () => {
    const portfolio = await service.get(createdItem.identifier);

    expect(portfolio).toMatchObject(createdItem);
  });

  it('can list portfolios', async () => {
    const portfolios = await service.find();

    expect(portfolios).toContainEqual(createdItem);
  });

  it('can remove the portfolio', async () => {
    const portfolio = await service.remove(
      parseIdentifier(createdItem.identifier)
    );

    expect(portfolio).toHaveProperty('$metadata');
  });
});
