import { Id, Paginated, Params } from '@feathersjs/feathers';
import { Data } from '../app_service';
import { ElasticSearchService } from '../elasticsearch_service';

export class Marketplace extends ElasticSearchService {
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    const size = params?.query?.size || 50;
    const from = params?.query?.from || 0;
    const {query, orderBy, orderDir} = params?.query as any;

    const baseQuery = `${query}`;
    const results = {hits: []};

    try {
      const {body} = await this.client.search({
        index: 'marketplace_v1',
        body: {
          query: {
            query_string: {
              query: baseQuery,
            },
          },
          size,
          from,
        },
      });
      const results = body
    } catch (error) {
      console.log(error);
    }

    return results.hits;
  }

  async get(id: Id, params?: Params): Promise<Data> {
    const query = {
      index: 'marketplace_v1',
      id: `${id}`,
      _source: undefined,
    };

    const {body} = await this.client.get(query);

    return body;
  }

  async create(data: any, params: Params | undefined): Promise<any> {
    ['identifier', 'created_at'].forEach((key) => {
      delete data[key];
    });

    const {body} = await this.client.search({
      index: 'marketplace_v1',
      body: data,
    });

    return body.hits;
  }
}
