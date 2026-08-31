// Initializes the `pools` service on path `/pools`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Pools } from './pools.class';
import hooks from './pools.hooks';

export default function (app: Application): void {
  const { poolsNode: node } = app.get('web3');

  // Initialize our service with any options it requires
  app.use('/pools', new Pools({ node }, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pools');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`pools-${connection?.user?.user_sub}`).join(connection);
  });
}
