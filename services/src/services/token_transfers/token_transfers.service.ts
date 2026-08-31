// Initializes the `token_transfers` service on path `/token_transfers`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { TokenTransfers } from './token_transfers.class';
import hooks from './token_transfers.hooks';

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/token_transfers', new TokenTransfers(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('token_transfers');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`token_transfers-${connection?.user?.user_sub}`).join(connection);
  });
}
