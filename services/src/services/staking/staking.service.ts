// Initializes the `wallets` service on path `/wallets`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Staking } from './staking.class';
import hooks from './staking.hooks';

export default function (app: Application): void {
  // Initialize our service with any options it requires

  const options:any = {
    paginate: app.get('paginate'),
  };

  app.use('/staking', new Staking(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('staking');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`staking-${connection?.user?.user_sub}`).join(connection);
  });
}
