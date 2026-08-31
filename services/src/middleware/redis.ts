/**
 * This middleware sets up Redis for syncing or (@TODO) cache.
 */
import { Application } from '../declarations';
import sync from 'feathers-sync';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require('ioredis');

export function redis(app: Application): void {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  const { endpoint: redisEndpoint, port: redisPort } = app.get('redis');

  app.configure(
    sync({
      uri: `redis://${redisEndpoint}:${redisPort}`,
    })
  );
}
