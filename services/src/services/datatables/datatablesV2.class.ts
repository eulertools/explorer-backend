/* eslint-disable no-unused-vars */
import { AppService, Data } from '../app_service';
import _, { map } from 'lodash';
import axios from 'axios';


// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require('ioredis');

const redisEndpoint = process.env.REDIS_ENDPOINT!
const redisPort = process.env.REDIS_PORT!

const redis = new Redis({
  port: redisPort,
  host: redisEndpoint,
});

interface Ohlc {
  time: string,
  date_time: Date,
  open: string,
  high: string,
  low: string,
  close: string,
  volume: number,
}
interface VolumeChart {
  date: Date,
  time: string,
  volume: string,
}
export class DatatablesV2 extends AppService {

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async find(params: any): Promise<Data[]> {

    const {from, symbol, to, window, countback} = params.query;

    const vs_currency: string = (symbol.includes('USDT') || symbol.includes('USDC')) ? 'BUSD' : 'USDT'

    const pair = `${symbol.toUpperCase()}|${vs_currency.toUpperCase()}`

    const apiOhlc = `${process.env.OHLC_SERVICE}/history?pair=${pair}&from=${from}&to=${to}&window=${window}&countback=${countback}`
    try {

      const api = await axios
        .get(apiOhlc);

      return api.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

function nearDate(arrVolume: VolumeChart[], date: Date, indice: number) {

  let actualBestDate: Date = arrVolume[0].date;
  let volume = 0;
  let isGreater = false;

  while (indice < arrVolume.length && !isGreater) {
    if (date < arrVolume[indice].date) {
      isGreater = true
    }
    if (isBestOcurrency(arrVolume, indice, date, actualBestDate)) {
      actualBestDate = arrVolume[indice].date;
      volume = parseFloat(arrVolume[indice].volume);
    }
    indice++;
  }
  return [indice, volume]
}

function isBestOcurrency(arrVolume: VolumeChart[], indice: number, date: Date, actual: Date) {
  return (Math.abs(date.getTime() - arrVolume[indice].date.getTime())) <= Math.abs((date.getTime() - actual.getTime()));
}
