import { Id, Params } from '@feathersjs/feathers';
import Web3 from 'web3';
import { Data } from '../aurora_data_service';
import { AppService } from "../app_service";

export class Blocks extends AppService {

  async get(id: Id, params?: Params): Promise<Data> {
    const {poolsNode: node} = this.app.get('web3');
    const web3 = new Web3(node);
    const block = await web3.eth.getBlock(id);

    return {
      number: block.number,
      timestamp: block.timestamp,
      transactions: block.transactions,
      miner: block.miner.toLowerCase(),
      difficulty: block.difficulty,
      total_difficulty: block.totalDifficulty,
      size: block.size,
      gas_used: block.gasUsed,
      gas_limit: block.gasLimit,
      extra_data: block.extraData,
      hash: block.hash,
      parent_hash: block.parentHash,
      sha3_uncles: block.sha3Uncles,
      nonce: block.nonce
    };
  }
}
