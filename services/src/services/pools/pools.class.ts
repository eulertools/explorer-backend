/* eslint-disable no-unused-vars */
import Web3 from 'web3';
import { AbiItem } from 'web3-utils/types';
import { Application } from '../../declarations';
import { AppService, Data, ServiceOptions } from '../app_service';

export class Pools extends AppService {
  protected web3: Web3;

  constructor(options: ServiceOptions, app: Application) {
    super(options, app);

    const { poolsNode: node } = this.app.get('web3');
    this.web3 = new Web3(new Web3.providers.HttpProvider(node));
  }

  async get(id: any, params: any): Promise<Data> {
    try {
      const poolAddress = id;
      if (!poolAddress)
        throw 'No address was provided in query string parameters';

      // The minimum ABI to get ERC20 Token balance
      const pool = {
        address: poolAddress,
        balance: 0.0,
        abi: [
          // balanceOff
          {
            constant: true,
            inputs: [{ name: '_owner', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ name: 'balance', type: 'uint256' }],
            type: 'function',
          },
          // firstToken
          {
            constant: true,
            inputs: [],
            name: 'token0',
            outputs: [{ name: '', type: 'address' }],
            type: 'function',
          },
          // secondToken
          {
            constant: true,
            inputs: [],
            name: 'token1',
            outputs: [{ name: '', type: 'address' }],
            type: 'function',
          },
          // decimals
          {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [{ name: '', type: 'uint8' }],
            type: 'function',
          },
          // TotalSupply
          {
            constant: true,
            inputs: [],
            name: 'totalSupply',
            outputs: [{ name: '', type: 'uint256' }],
            type: 'function',
          },
        ],
      };

      const tokenABI = [
        // decimals
        {
          constant: true,
          inputs: [],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint8' }],
          type: 'function',
        },
        // balanceOf
        {
          constant: true,
          inputs: [{ name: '_owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: 'balance', type: 'uint256' }],
          type: 'function',
        },
        // name
        {
          constant: true,
          inputs: [],
          name: 'name',
          outputs: [{ name: '', type: 'string' }],
          type: 'function',
        },
        // name
        {
          constant: true,
          inputs: [],
          name: 'symbol',
          outputs: [{ name: '', type: 'string' }],
          type: 'function',
        },
      ];

      const baseToken = {
        abi: tokenABI,
        address: '',
        decimals: 0,
        contract: { methods: {} },
        balance: 0.0,
      };
      const quoteToken = {
        abi: tokenABI,
        address: '',
        decimals: 0,
        contract: { methods: {} },
        balance: 0.0,
      };

      // Get ERC20 Token contract instance
      const poolContract = new this.web3.eth.Contract(
        pool.abi as AbiItem[],
        pool.address
      );
      const poolToken1 = await poolContract.methods.token0().call();
      const poolToken2 = await poolContract.methods.token1().call();
      const totalSupply = await poolContract.methods.totalSupply().call();

      [baseToken.address, quoteToken.address, pool.balance] = await Promise.all(
        [poolToken1, poolToken2, totalSupply]
      );

      baseToken.contract = new this.web3.eth.Contract(
        tokenABI as AbiItem[],
        baseToken.address
      );
      quoteToken.contract = new this.web3.eth.Contract(
        tokenABI as AbiItem[],
        quoteToken.address
      );

      const decimal1 = (baseToken?.contract?.methods as any).decimals().call();
      const decimal2 = (quoteToken?.contract?.methods as any).decimals().call();
      const balance1 = (baseToken?.contract?.methods as any)
        .balanceOf(pool.address)
        .call();
      const balance2 = (quoteToken?.contract?.methods as any)
        .balanceOf(pool.address)
        .call();

      [
        baseToken.decimals,
        quoteToken.decimals,
        baseToken.balance,
        quoteToken.balance,
      ] = await Promise.all([decimal1, decimal2, balance1, balance2]);

      try {
        baseToken.balance /= 10 ** baseToken.decimals;
      } catch {
        baseToken.balance = 0;
      }

      try {
        quoteToken.balance /= 10 ** quoteToken.decimals;
      } catch {
        quoteToken.balance = 0;
      }

      try {
        pool.balance /= 10 ** 18;
      } catch {
        pool.balance = 0;
      }

      return {
        poolAddress: pool.address,
        token1: {
          address: baseToken.address,
          balance: baseToken.balance,
        },
        token2: {
          address: quoteToken.address,
          balance: quoteToken.balance,
        },
        LPBalance: pool.balance,
        price: quoteToken.balance / baseToken.balance,
      };
    } catch (e) {
      // @TODO use proper debug
      console.log('[pools] getPoolBalanceByAddress', e);
      throw e;
    }

    return {};
  }

  async create(data: any[], params: any): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return data;
  }

  async update(id: any, data: any, params: any): Promise<Data> {
    return data;
  }

  async patch(id: any, data: any, params: any): Promise<Data> {
    return data;
  }

  async remove(id: any, params: any): Promise<Data> {
    return { id };
  }
}
