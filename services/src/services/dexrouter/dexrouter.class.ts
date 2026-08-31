import { Params } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import axios from 'axios';
import { AppService } from '../app_service';
import Web3 from 'web3';

interface ServiceOptions {
}

export class Dexrouter extends AppService {
  app: Application;
  options: ServiceOptions;
  driver: any;

  constructor(options: ServiceOptions = {}, app: Application) {
    super(options, app);

    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<any> {
    const {poolsNode: node} = this.app.get('web3');
    const web3 = new Web3(node);

    const tokenIn = params?.query?.tokenIn?.toLowerCase();

    const tokenOut = params?.query?.tokenOut?.toLowerCase();

    const priority_factory: any = {};

    if (params?.query?.priority_factory) {
      const param_priority_factory = JSON.parse(params?.query?.priority_factory);
      param_priority_factory.forEach((factory: string) => {
        priority_factory['addr_' + factory] = 0;
      });
    }

    let chain_id = params!.query!.chain_id;

    if (!chain_id) chain_id = this.app.get('chain_id');

    const amountInRaw: any = web3.utils.toWei(params!.query!.amountIn);
    const amountIn = web3.utils.toBN(amountInRaw);

    const result = await axios.get(`https://api.1inch.io/v5.0/56/quote?fromTokenAddress=${tokenIn}&toTokenAddress=${tokenOut}&amount=${amountIn}`);

    return {
      result: result.data,
    }
  }
}
