/* eslint-disable no-unused-vars */
import {Paginated} from '@feathersjs/feathers';
import {AppService, Data} from '../app_service';
import {
  dateRange,
  getBegginingOfTheDay,
  getEndOfTheDay,
} from './utils/timeutils';
import _ from 'lodash';
import moment from 'moment';
import {chainConfig} from '../../chainconfig/config';
import {DatatablesV2} from "./datatablesV2.class";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require('ioredis');

const redisEndpoint = process.env.REDIS_ENDPOINT!
const redisPort = process.env.REDIS_PORT!

const redis = new Redis({
  port: redisPort,
  host: redisEndpoint,
});

export class Datatables extends AppService {
  async find(params: any): Promise<Data[] | Paginated<Data>> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const {stable_coins, wad_address, wad_stable_pair, chain_tokens} = chainConfig();

    const stable_tokens = [...stable_coins];

    const sqlClient = this.app.get('sequelizeClient');

    //Extract date range
    const since = params.query.since;
    const till = params.query.till;
    const window = params.query.window;
    const limit = parseInt(params.query.countback);

    const baseCurrency = params.query.token_address.toLowerCase();

    if (wad_address !== baseCurrency && !stable_tokens.includes(wad_address.toLowerCase())) {
      console.log("PUSHED")
      stable_tokens.push(wad_address.toLowerCase());
    }

    if (stable_tokens.includes(baseCurrency.toLowerCase())) {
      const baseCoin = chain_tokens.find((token: { address: any; }) => token.address.toLowerCase() === baseCurrency.toLowerCase())
      const newParams = {
        from: new Date(since).getTime() / 1000,
        symbol: baseCoin.name,
        to: new Date(till).getTime() / 1000,
        window: parseInt(window),
        countback: limit
      }
      params.query = {...newParams}
      return new DatatablesV2(this.options, this.app).find(params)
    }

    const chartDates = dateRange(since, till).reverse();

    const candles = chartDates.map(async (dayToCheck, index, dates) => {
      const sinceKey = getBegginingOfTheDay(dayToCheck);
      const tillKey = getEndOfTheDay(dayToCheck);
      const hashKey = `cache~${baseCurrency}~${sinceKey}~${window}`;
      let deltaKey = sinceKey;
      let bars: any[] = [];

      let cachedResults: any[] = []

      const cached = await redis
        .get(hashKey)
        .then((res: string) => JSON.parse(res));

      if (cached) {
        return cached
      }

      if (
        getBegginingOfTheDay(new Date().toISOString()) === sinceKey ||
        dayToCheck === dates[dates.length - 1]
      ) {
        cachedResults = [];
      }

      let range;
      if (cachedResults && cachedResults.length > 0) {
        bars = cachedResults;
        deltaKey = new Date(
          cachedResults[cachedResults.length - 1].time
        ).toISOString();
        return bars;
      }

      const beginKey = moment(deltaKey).utc().format('YYYY-MM-DD HH:mm:ss');
      const endKey = moment(tillKey).utc().format('YYYY-MM-DD HH:mm:ss');

      if (window === '1D') {
        range = 'DAY';
      } else if (parseInt(window) > 1) {
        range = 'HOUR';
      } else {
        range = 'MINUTE';
      }

      let quote_conditions;
      if (baseCurrency !== wad_address) {
        quote_conditions = `ANY (ARRAY${JSON.stringify(stable_tokens).replace(
          /"/g,
          "'"
        )})`;
      } else {
        quote_conditions = `'${wad_stable_pair.quote_address.toLowerCase()}'`;
      }

      let token_condition = `(
                     (base_token = LOWER('${baseCurrency}') AND
                      quote_token =  ${quote_conditions})
                     OR
                     (quote_token = LOWER('${baseCurrency}') AND
                      base_token =  ${quote_conditions})
                   )`;

      if (
        process.env.CHAIN_ID === 'bsc' &&
        baseCurrency.toLowerCase() == wad_address.toLowerCase()
      ) {
        token_condition =
          token_condition +
          ` AND address='${wad_stable_pair.address.toLowerCase()}' `;
      }

      let limitCondition;
      if (limit === 2) {
        limitCondition = 2;
      } else if (range == 'DAY') {
        limitCondition = 30;
      } else if (range == 'HOUR') {
        limitCondition = 240;
      } else {
        limitCondition = 320;
      }

      const limitQuery = `LIMIT ${limitCondition}`;

      const queryLimit = `(SELECT date_trunc('${range}', block_timestamp) as timestamp,
        percentile_disc(0.85) within group (order by price_usd desc) as lower_limit,
        percentile_disc(0.85) within group (order by price_usd) as upper_limit
        FROM raw.trades
        WHERE block_timestamp between '${beginKey}'::timestamp and '${endKey}'::timestamp
        AND ${token_condition}
        AND price_usd > 0
        AND volume > 0
        GROUP BY date_trunc('${range}', block_timestamp)) as l`;

      const query = `SELECT *
                     FROM (SELECT EXTRACT(EPOCH FROM date_trunc('${range}', block_timestamp)) * 1000 as block_timestamp,
                                  (array_agg(price_usd order by block_timestamp asc))[1]                   as open,
                                  (array_agg(price_usd order by block_timestamp desc))[1]                  as close,
                                  MIN(price_usd)                                                     as low,
                                  MAX(price_usd)                                                     as high,
                                  SUM(volume)                                                        as volume
                           FROM raw.trades
                           INNER JOIN ${queryLimit} ON l.timestamp = date_trunc('${range}', block_timestamp)
                           WHERE block_timestamp between '${beginKey}'::timestamp and '${endKey}'::timestamp
                             AND ${token_condition}
                             AND price_usd >= l.lower_limit and price_usd <= l.upper_limit
                             AND volume > 0
                           GROUP BY date_trunc('${range}', block_timestamp)
                           ORDER by block_timestamp desc
                          ) as OHLVC ${limitQuery}`;

      const [results, _metadata] = await sqlClient.query(query);

      results.map((element: any, index: number, array: any[]) => {
        bars.push({
          high: parseFloat(element.high),
          close: parseFloat(element.close),
          volume: parseFloat(element.volume),
          low: parseFloat(element.low),
          open: parseFloat(element.open),
          time: new Date(element.block_timestamp).getTime(),
          date_time: new Date(element.block_timestamp).toISOString(),
        });
      });

      const sqlBars = _.chain(bars)
        .flatten()
        .filter((el) => el)
        .uniqBy('time')
        .value();

      if (sqlBars.length > 0) {
        await redis.set(hashKey, JSON.stringify(sqlBars));
      }

      return sqlBars;
    });

    const responses = await Promise.all(candles);

    const results = _.chain(responses)
      .flatten()
      .filter((el) => el)
      .uniqBy('time')
      .sortBy('time', 'desc')
      .filter(
        (element) =>
          element.time >= new Date(since).getTime() &&
          element.time <= new Date(till).getTime()
      )
      .map((candle, index, array) => {
        const open = index == 0 ? candle.open : array[index - 1].close;
        return {
          ...candle,
          open,
        };
      })
      .value();

    return results;
  }

  async get(params: any): Promise<Data> {
    return {
      supports_search: true,
      supports_group_request: false,
      supported_resolutions: [
        '1',
        '5',
        '15',
        '30',
        '60',
        '1h',
        '4h',
        '8h',
        //'1D',
        //'1W',
        //'1M',
      ],
      supports_marks: false,
      supports_timescale_marks: false,
      has_intraday: true,
    };
  }
}
