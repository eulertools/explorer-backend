import { FeathersError } from '@feathersjs/errors';
import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Data } from '../app_service';
import { ElasticSearchService } from '../elasticsearch_service';

export class Pairs extends ElasticSearchService {
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    const size = params?.query?.size || 50;
    const from = params?.query?.from || 0;
    const { owner, liquidity, query, orderBy, orderDir } = params?.query as any;

    const bodyQuery = {
      bool: {
        filter: {
          bool: {
            should: [
              { match: { base_token_address: query } },
              { match: { quote_token_address: query } },
            ],
            must_not: [
              { terms: { category: ['lp-token', 'address', 'pair'] } },
            ],
          },
        },
        should: [
          {
            bool: {
              must: [
                { term: { category: 'pool' } },
                { range: { liquidity: { gte: liquidity || 1 } } },
              ],
            },
          },
        ],
      },
    };

    const { body } = await this.client.search({
      index: this.app.get('es_index'),
      body: {
        query: bodyQuery,
        size,
        from,
        sort: { total_volume_locked: 'desc' },
      },
    });

    return body.hits;
  }

  async get(id: Id, params?: Params): Promise<Data | null> {
    let response: any = null;

    try {
      const { body } = await this.client.get({
        index: this.app.get('es_index'),
        id: `${this.app.get('chain_id')}~contract~${id}`,
      });
      response = body;
    } catch ({ body }) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        body?.found === false
          ? "The requested item wasn't found"
          : 'An unexpected error happened',
        'BadRequest',
        400,
        'not-found',
        {}
      );
    }

    return response;
  }

  async create(data: any, params: Params | undefined): Promise<any> {
    ['identifier', 'created_at'].forEach((key) => {
      delete data[key];
    });

    const { body } = await this.client.search({
      index: this.app.get('es_index'),
      body: data,
    });

    return body.hits;
  }

  async update(
    id: NullableId,
    data: any,
    params: Params | undefined
  ): Promise<any> {
    console.log('updated');
    try {
      const response = { test: 123 };
      return response;
    } catch (err) {
      return new FeathersError(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        err?.message,
        'BadRequest',
        400,
        'bad-request',
        {}
      );
    }
  }
}
