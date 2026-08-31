import { Id, Params } from '@feathersjs/feathers';
import { AppService, Data } from '../app_service';
import { Application } from '../../declarations';
import axios from 'axios';
import network from '../settings/network';

// Initialize Redis
const Redis = require('ioredis');

const redisEndpoint = process.env.REDIS_ENDPOINT!;
const redisPort = process.env.REDIS_PORT!;

const redis = new Redis({
  port: redisPort,
  host: redisEndpoint,
});

interface ServiceOptions {
}

export class TokensSecurity extends AppService{

  constructor(options:ServiceOptions, app:Application){
    super(options, app);
  }

  async get(id: Id, params?: Params): Promise<Data> {

    // Get {chain_id} and {address}
    const address = id.toString().toLowerCase()
    const chain = this.app.get('chain_id');
    const chain_id = network[chain].chain_id;

    const cached_data = async () =>{ 
      
      // Generate the key for the data
      const hashKey = `cache~${chain_id}~${address}`;
      
      // Check if the key is in redis
      let cacheEntry = await redis.get(hashKey);
      
      if(!cacheEntry){

        // If the key is not found, make the API call
        const apiURL = `https://api.gopluslabs.io/api/v1/token_security/${chain_id}?contract_addresses=${address}`
        const api = await axios
          .get(apiURL);

        // Add the key to redis
        redis.set(hashKey, JSON.stringify(api.data))

        return api.data

      }else{

        // If the key is found, use the cached data
        cacheEntry = JSON.parse(cacheEntry)

        return cacheEntry
      }
    }

    return cached_data();

  }
}

