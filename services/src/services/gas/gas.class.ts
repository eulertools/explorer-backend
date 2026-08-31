import { Params, Paginated } from '@feathersjs/feathers';
import Web3 from 'web3';
import { Application } from '../../declarations';
import { AppService } from "../app_service";
import { Data } from '../app_service';
import network from '../settings/network'
import gasValues from './utils/gasValues.json'

interface ServiceOptions {
}

export class Gas extends AppService {

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);
  }

  async create(data: any, params: Params | undefined): Promise<Data[] | Paginated<Data>> {

    const gas = data.gas || 5;
    const action = data.action.toLowerCase();
    const section = data.section;

    const smartContract = network.bsc.products[section];
    const { sections }:any = gasValues;

    const { poolsNode: node } = this.app.get('web3');
    const web3 = new Web3(node);

    const contract_params = () => {
      const keys = Object.keys(data.contract_params);

      const inputs_keys:any = []
      const inputs = sections[section][action].method[0].inputs;
      
      for(const input of inputs){
        inputs_keys.push(input.name)
      }

      const sort_keys = keys.sort( (a,b) => {
        return inputs_keys.indexOf(a) - inputs_keys.indexOf(b);
      })

      const params = sort_keys.reduce( (acc:any, key:any) => {
        acc[key] = data.contract_params[key];

        return acc;
      }, {})

      return params;
    }

    const getFees = async (args:any) => {

      const methods  = sections[section][action].method;
      const contract = new web3.eth.Contract(methods, smartContract);

      return contract.methods[methods[0].name](...args).call();
    }

    const gasToEther:any = web3.utils.fromWei(gas.toString(), "gwei");
    const gasFee = sections[section][action].value * gasToEther;
    const euler_fee = web3.utils.fromWei(await getFees(Object.values(contract_params())));

    const response = {
      "euler_fee": euler_fee,
      "blockchain_cost": gasFee
    }

    return [response];
  }
}