/* eslint-disable no-unused-vars */
import Web3 from 'web3';
import axios from 'axios';
import { Client } from '@opensearch-project/opensearch';
import { AbiItem } from 'web3-utils/types';
import { Data } from '../app_service';
import { DynamoDataService } from '../dynamo_data_service';
import { chainConfig } from '../../chainconfig/config';

export class Addresses extends DynamoDataService {

  async get(id: any, params: { query: { token: any } }): Promise<Data> {
    const {poolsNode: node} = this.app.get('web3');
    const {wad_address} = chainConfig();
    const web3 = new Web3(node);

    try {
      const query = new URLSearchParams({
        verified: 'true',
        chainId: 'false',
        token: 'false',
        auth_key: '6hBu62xiRZ4vbsuBBEk7parOCWYnYO5EaUmEx8a0'
      }).toString();

      const chain = 'bsc';
      const resp = await axios.get(
        `https://api.unmarshal.com/v1/${chain}/address/${id}/assets?${query}`,
      );

      const tokenList = await resp.data;

      const esClient = new Client({
        nodes: [this.app.get('new_elasticsearch')],
        ssl: {
          rejectUnauthorized: false,
        },
        maxRetries: 5,
        requestTimeout: 60000,
        sniffOnStart: false,
      });

      const tokens = await Promise.all(
        tokenList.map(async (result: any) => {
          let tokenAddress = result.contract_address;
          console.log("token info", result);
          tokenAddress = web3.utils.toChecksumAddress(tokenAddress);

          const {body} = await esClient
            .search({
              index: this.app.get('new_index'),
              body: {
                query: {
                  term: {
                    "networks.bnb.address": {
                      "value": tokenAddress.toLowerCase()
                    }
                  }
                },
                _source: ["network.bnb.address", "coingecko_id", "identifier", "name", "symbol", "price_usd.cg", "image.cg", "price_change_percentage_1h.cg", "price_change_percentage_24h.cg", "price_change_percentage_7d.cg", "price_change_percentage_30d.cg", "price_change_percentage_1y.cg"]
              }
            })
          // The minimum ABI to get ERC20 Token balance
          const minABI = [
            // balanceOf
            {
              constant: true,
              inputs: [{name: '_owner', type: 'address'}],
              name: 'balanceOf',
              outputs: [{name: 'balance', type: 'uint256'}],
              type: 'function',
            },
            // decimals
            {
              constant: true,
              inputs: [],
              name: 'decimals',
              outputs: [{name: '', type: 'uint8'}],
              type: 'function',
            },
          ];

          // Get ERC20 Token contract instance
          const contract = new web3.eth.Contract(
            minABI as AbiItem[],
            tokenAddress
          );
          const token = body.hits.hits[0];
          // Call balanceOf function
          try {
            const balance = contract.methods.balanceOf(id).call();
            const decimals = contract.methods.decimals().call();
            const data = await Promise.all([balance, decimals]);
            let balanceOfWallet;

            try {
              balanceOfWallet = data[0] / 10 ** data[1];
            } catch {
              balanceOfWallet = 0;
            }

            const value = token ? token._source?.price_usd.cg : 0;
            return {
              name: tokenAddress,
              quantity: balanceOfWallet,
              token: token,
              value,
            };
          } catch (e) {
            return {
              name: tokenAddress,
              quantity: 0,
              token: token,
            };
          }
        })
      );
      const valueBNB = tokens.find((el) => {
        return (el.name == web3.utils.toChecksumAddress(wad_address));
      });

      const balanceInWei = await web3.eth.getBalance(id);

      let balance: any = web3.utils.fromWei(balanceInWei, 'ether');
      balance = parseFloat(balance);

      let total = tokens.reduce((a, b: any) => a + (b.value != null ? b.value * b.quantity : 0), 0);
      let totalBNB = 0;
      if (valueBNB && valueBNB.value) {
        total += valueBNB.value * balance;
        totalBNB = tokens.reduce((a, b: any) => a + (b.value != null ? ((b.value * b.quantity) / valueBNB.value) : 0), 0);
      }
      totalBNB += balance;

      tokens.sort((a, b) => {
        return b.value - a.value;
      });

      return {tokens, total, totalBNB, balance};
    } catch (e) {
      console.log('[wallets] bscIntegration - getBalanceByAddress', e);
      return {};
    }
  }
}
