import { Id, Params } from '@feathersjs/feathers';
import { AppService, Data } from '../app_service';
import Web3 from 'web3';
import getTx from './helpers/getTx';

export class Transactions extends AppService {

  async get(id: Id, params?: Params): Promise<Data> {
    const {poolsNode: node} = this.app.get('web3');
    const web3 = new Web3(node);
    return await getTx(web3, id);
  }
}
