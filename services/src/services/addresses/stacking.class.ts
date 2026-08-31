/* eslint-disable no-unused-vars */
import Web3 from 'web3';
import { AbiItem } from 'web3-utils/types';
import { Data } from '../app_service';
import { DynamoDataService } from '../dynamo_data_service';
import axios from 'axios';

export class Stacking extends DynamoDataService {
  async get(id: any, params: { query: { token: any } }): Promise<Data> {
    const { poolsNode: node } = this.app.get('web3');
    const web3 = new Web3(node);

    const { token } = params.query;
    const prices = await axios
      .get('https://catalog.prod.euler.tools/prices')
      .then((response) => response.data);

    try {
      // The minimum ABI to get ERC20 Token balance
      const minABI = [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'pid',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '_user',
              type: 'address',
            },
          ],
          name: 'pendingRewards',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'userInfo',
          outputs: [
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'rewardDebt',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'pendingRewards',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'lastClaim',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ];

      // Get ERC20 Token contract instance
      const contract = new web3.eth.Contract(
        minABI as AbiItem[],
        '0x38Ab2128327107D075a13E6Ed66Bd6184E4Cc20c'
      );

      // Call balanceOf function
      const pendingRewards = contract.methods.pendingRewards(0, id).call();
      const userInfo = contract.methods.userInfo(0, id).call();

      const data = await Promise.all([pendingRewards, userInfo]);

      return {
        pendingRewards: data[0],
        userInfo: data[1],
      };
    } catch (e) {
      console.log('[wallets] bscIntegration - getBalanceByAddress', e);
      return {};
    }
  }
}
