import { AppService } from '../app_service';

export class Trades extends AppService {
  /*async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    const sqlClient = this.app.get('sequelizeClient');
    const {wad_address, stable_coins, wad_stable_pair} = chainConfig();

    const {address, $limit, $skip, block_timestamp, volume} = params!.query!;

    const limit = parseInt($limit);
    const skip = parseInt($skip);

    let beginDate: Moment = moment(new Date()).utc();
    let endDate: Moment = moment(new Date()).utc();

    if (block_timestamp && block_timestamp.$gte && block_timestamp.$lte) {
      beginDate = moment(block_timestamp.$gte).utc();
      endDate = moment(block_timestamp.$lte).utc();
    }

    const begin = beginDate.format('YYYY-MM-DD HH:mm:ss');
    const end = endDate.format('YYYY-MM-DD HH:mm:ss');

    const baseCurrency = address.toLowerCase();

    if (wad_address !== baseCurrency) {
      stable_coins.push(wad_address.toLowerCase());
    }

    let quote_conditions;
    if (baseCurrency !== wad_address) {
      quote_conditions = `ANY (ARRAY${JSON.stringify(stable_coins).replace(
        /"/g,
        "'"
      )})`;
    } else {
      quote_conditions = `'${wad_stable_pair.quote_address.toLowerCase()}'`;
    }

    const token_condition = `(
                     (base_token = LOWER('${baseCurrency}') AND
                      quote_token =  ${quote_conditions})
                     OR
                     (quote_token = LOWER('${baseCurrency}') AND
                      base_token =  ${quote_conditions})
                   )`;

    const countQuery = `SELECT count(*)
                        FROM raw.trades
                        WHERE block_timestamp between '${begin}'::timestamp - INTERVAL '6 HOURS' and '${end}'::timestamp
                          AND ${token_condition}
                          AND volume > 0
                          AND price_usd > 0`;

    const [resultsCount, _metadatacount] = await sqlClient.query(countQuery);

    const resultsQuery = `SELECT *
                          FROM raw.trades
                          WHERE block_timestamp between '${begin}'::timestamp and '${end}'::timestamp
                            AND ${token_condition}
                            AND volume > 0
                            AND price_usd > 0
                          ORDER BY block_timestamp desc
                          OFFSET ${skip} LIMIT ${limit}`;

    let data;
    if (limit > 0) {
      const [results, _metadata] = await sqlClient.query(resultsQuery);
      data = results;
    } else {
      data = [];
    }

    const total = parseInt(resultsCount[0].count);

    return {
      total,
      limit,
      skip,
      data,
    };
  }*/
}
