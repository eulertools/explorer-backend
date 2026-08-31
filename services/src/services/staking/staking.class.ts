import { Params } from '@feathersjs/feathers';
import _, { toNumber } from 'lodash';
import { Application } from '../../declarations';
import { QueryTypes } from 'sequelize';
import { AppService } from '../app_service';
import utils from 'web3-utils';
import { Client } from '@opensearch-project/opensearch';

interface ServiceOptions {
}

export class Staking extends AppService {

  private esclient: Client;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

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

  async find(params?: Params): Promise<any> {

    const date = params?.query?.date;

    const contract = params?.query?.contract;

    const token = params?.query?.token;

    let amount = 0;

    if(params?.query?.amount) {
      amount = toNumber(params?.query?.amount);
    }

    const chain_id = this.app.get('chain_id');

    const token_query = {
      index: this.app.get('es_index'),
      id: `${chain_id}~token~${utils.toChecksumAddress(token)}`,
      _source: undefined,
    };

    const resultToken = await this.esclient.get(token_query);

    const decimals = resultToken?.body?._source.decimals;

    const sequelize = this.app.get('sequelizeClient');

    const result = (await sequelize.query(`
      select count(*) as users, sum(sum) / (10 ^ :decimals) as tvl
      from (select from_address, sum(case when input then value else (value * -1) end) as sum
      from raw.farm_transfers ft
      where ft.block_timestamp <= :date and ft.contract_address = :contract and token_lp_address = :token
      group by from_address) as w
      where w.sum >= :amount * 10 ^ :decimals`,
      {
        type: QueryTypes.SELECT,
        replacements: { date, contract, token, amount, decimals },
      }))[0];

    return {
      date,
      users: result.users,
      tvl: (result.tvl)
    };

  }
}
