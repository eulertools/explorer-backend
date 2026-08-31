import { Id, Paginated, Params } from '@feathersjs/feathers';
import { Data } from '../app_service';
import { Application } from '../../declarations';
import { Client } from '@elastic/elasticsearch';
import neo4j from 'neo4j-driver';
import { NewElasticSearchService } from "../new_elasticsearch_service";

interface ServiceOptions {
}

export class Tokens extends NewElasticSearchService {
  app: Application;
  options: ServiceOptions;
  driver: any;
  esclient: Client;

  constructor(options: ServiceOptions = {}, app: Application) {
    super(options, app);

    this.options = options;
    this.app = app;
    this.driver = neo4j.driver('neo4j+s://663cadde.databases.neo4j.io', neo4j.auth.basic('neo4j', '4QBPTfEwfmauH_KgWvMG4owkbinrijRmfz89lxEVnL8'));
    this.esclient = new Client({
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
    const {query, orderBy, orderDir} = params?.query as any;

    const {poolsNode: node} = this.app.get('web3');

    let baseQuery =
      'category:token AND kind:token AND _exists_:address AND NOT (category:"lp-token")';

    if (query && query.length > 1) baseQuery = baseQuery + ` AND ${query}`;

    let order = {} as any;
    if (false) {
      order[orderBy] = {order: orderDir};
    } else {
      order = {
        update_date: {
          order: 'asc',
        },
      };
    }

    const {body} = await this.client.search({
      index: this.app.get('new_index'),
      body: {
        query: {
          query_string: {
            query: baseQuery,
          },
        },
        size,
        from,
        sort: [order],
      },
    });

    return body.hits;
  }

  async get(id: Id, params?: Params): Promise<Data> {

    const chainId = params!.chain == 'bsc' ? 'bnb' : 'eth'

    const {body} = await this.client
      .search({
        index: this.app.get('new_index'),
        body: {
          query: {
            term: {
              [`networks.${chainId}.address`]: {
                "value": id.toString().toLowerCase()
              }
            }
          },
          _source: ["network.bnb.address", "coingecko_id", "identifier", "name", "symbol", "price_usd.cg", "image.cg", "price_change_percentage_1h.cg", "price_change_percentage_24h.cg", "price_change_percentage_7d.cg", "price_change_percentage_30d.cg", "price_change_percentage_1y.cg"]
        }
      })
    
    return body.hits.hits[0];
  }

  async create(data: any, params: Params | undefined): Promise<any> {
    ['identifier', 'created_at'].forEach((key) => {
      delete data[key];
    });

    const {body} = await this.client.search({
      index: this.app.get('es_index'),
      body: data,
    });

    return body.hits;
  }
}
