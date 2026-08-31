import { Client } from '@opensearch-project/opensearch';
import { Id, Paginated, Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AppService, Data, ServiceOptions } from '../app_service';

export class Search extends AppService {
  client: Client;

  constructor(options: ServiceOptions = {}, app: Application) {
    super(options, app);

    this.client = new Client({
      node: app.get('new_elasticsearch'),
      ssl: {
        rejectUnauthorized: false,
      },
      maxRetries: 5,
      requestTimeout: 60000,
      sniffOnStart: false,
    });
  }

  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    const size = params?.query?.size || 50;
    const from = params?.query?.from || 0;
    const { owner, liquidity, query, orderBy, orderDir } = params?.query as any;
    const baseQuery = {
      query: {
        bool: {
          should: [
            {
              term: {
                name: query.toLowerCase(),
              },
            },
            {
              term: {
                symbol: query.toLowerCase(),
              },
            },
          ],
          filter: {
            exists: {
              field: 'coin',
            },
          },
        },
      },
    };

    const { body } = await this.client.search({
      index: this.app.get('es_index'),
      body: {
        ...baseQuery,
        size,
        from,
        _source: ['symbol', 'name', 'address', 'category', 'kind'],
      },
    });

    return body.hits;
  }

  async get(id: Id, params?: Params): Promise<Data> {
    const { body } = await this.client.get({
      index: this.app.get('es_index'),
      id: `${id}`,
    });

    return body;
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
}
