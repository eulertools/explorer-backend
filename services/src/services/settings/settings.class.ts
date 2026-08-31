import { Params } from '@feathersjs/feathers';
import { AppService } from '../app_service';
import network from './network';

export class Settings extends AppService {

  async find(params?: Params): Promise<any> {

    try {
      return {
        aws: {
          region: process.env.AWS_REGION,
          cognito: {
            region: process.env.AWS_REGION,
            pool_id: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
            client_id: process.env.AWS_USER_POOLS_WEB_CLIENT_ID
          }
        },
        gtm: {
          id: process.env.GTM_CONTAINER_ID
        },
        urls: {
          api: `https://catalog.${process.env.DOMAIN}`,
          private_api: `https://catalog.${process.env.DOMAIN}`,
          ws: process.env.WSS_HOST || `wss://catalog.${process.env.DOMAIN}/${process.env.CHAIN_ID}`,
          nft_api: process.env.NFT_API || `https://nft.api.${process.env.DOMAIN}`,
          directory_api: `https://directory.api.${process.env.DOMAIN}`,
          app: `https://app.${process.env.DOMAIN?.replace('app.prod', '')}`,
        },
        external_links: {
          pancakeSwap: 'https://pancakeswap.finance/swap?',
          pancakeSwapv1: 'https://v1exchange.pancakeswap.finance/#/swap?',
          mdex: 'https://bsc.mdex.com/#/swap?',
          unisave: 'https://app.unisave.exchange/#/swap?',
          biswap: 'https://exchange.biswap.org/#/swap?',
          apeswap: 'https://app.apeswap.finance/swap?',
          alitaswap: 'https://exchange.alita.finance/#/swap?',
          wardenswap: 'https://www.wardenswap.finance/#/best-rate-swap?',
          babyswap: 'https://exchange.babyswap.finance/#/swap?',
          bscswap: 'https://trade.bscswap.com/#/swap?',
          bakeryswap: 'https://www.bakeryswap.org/#/swap?'
        },
        chain: {
          ...network
        },
        features: {
          marketplaceV2Enabled: true,
          marketsDisabled: false,
          profilesDisabled: process.env.DOMAIN === "prod.euler.tools",
          nftDisabled: process.env.DOMAIN === "prod.euler.tools",
        }
      }
    } catch (error) {
      console.log(error);
      //return the error as json response
      return error;
    }
  }
}
