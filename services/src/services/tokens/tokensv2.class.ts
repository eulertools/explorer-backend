import {Id, Paginated, Params} from '@feathersjs/feathers';
import {Data} from '../app_service';
import {Application} from '../../declarations';
import {Client} from '@elastic/elasticsearch';
import neo4j from 'neo4j-driver';
import {NewElasticSearchService} from "../new_elasticsearch_service";

interface ServiceOptions {
}

export class Tokensv2 extends NewElasticSearchService {
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    const size = params?.query?.size || 50;
    const from = params?.query?.from || 0;
    const {query, orderBy, orderDir, fields} = params?.query as any;

    let conditions = {}

    if (query && query.length) {
      conditions = {
        query_string: {
          query: query,
        }
      }
    } else {
      conditions = {match_all: {}}
    }

    const sort = [];
    if (orderBy && orderDir) {
      sort.push({
        [orderBy]: {
          order: orderDir
        },
      });
    } else {
      sort.push({
        'market_cap.cg': {
          order: 'desc',
          unmapped_type: "long"
        },
      });
    }

    try {
      const {body} = await this.client.search({
        index: this.app.get('new_index'),
        body: {
          query: conditions,
          size,
          from,
          sort,
          _source: fields?.split(',') || undefined
        }

      });

      return body.hits;
    } catch (e) {
      console.log(e);
      return [{error: e}]
    }


  }

  async get(id: Id, params?: Params): Promise<Data> {
    const {poolsNode: node} = this.app.get('web3');

    const fields = params?.query?.fields;

    const query = {
      index: this.app.get('new_index'),
      id: `${id}`,
      _source: undefined,
    };

    if (fields && fields.length) {
      query._source = fields;
    }

    const {body} = await this.client.get(query);

    return body;
  }

  async create(data: any, params: Params | undefined): Promise<any> {
    ['identifier', 'created_at'].forEach((key) => {
      delete data[key];
    });

    const {body} = await this.client.search({
      index: this.app.get('new_index'),
      body: data,
    });

    return body.hits
  }
}
