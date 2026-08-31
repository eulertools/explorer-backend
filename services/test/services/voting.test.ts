import omit from 'lodash/omit';
import app from '../../src/app';
import voteMock from '../../src/mocks/vote.json';
import userMock from '../../src/mocks/user.json';
import { pick } from 'lodash';
import { parseIdentifier } from '../../src/utils/dynamo_utils';

describe("'voting' service", () => {
  let service: any;
  let createdItem: any;

  beforeAll(() => {
    service = app.service('voting');
  });

  beforeEach(() => {
    if (createdItem) {
      createdItem.user_sub = userMock.sub;
    }
  });

  it('registered the service', () => {
    expect(service).toBeTruthy();
  });

  it('can create a vote', async () => {
    const compareAttrs = ['item_name', 'item_type'];
    createdItem = await service.create(voteMock);

    expect(createdItem).toHaveProperty('identifier');
    expect(createdItem).toMatchObject(omit(voteMock, ['identifier']));
  });

  it('can retrieve the votes for a project', async () => {
    const voting = await service.find({
      query: {
        item_name: voteMock.item_name,
        item_type: voteMock.item_type,
      },
    });

    expect(voting).toHaveProperty('count');
    expect(voting.count).toBeGreaterThan(0);
  });

  it('can remove the vote', async () => {
    const voting = await service.remove(
      parseIdentifier(createdItem.identifier)
    );

    expect(voting).toHaveProperty('$metadata');
  });
});
