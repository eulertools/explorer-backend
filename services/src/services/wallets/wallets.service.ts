// Initializes the `wallets` service on path `/wallets`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Wallets } from './wallets.class';
import hooks from './wallets.hooks';

export default function (app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: { userEntities },
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    table: userEntities,
    primaryKey: 'identifier',
  };

  app.use('/wallets', new Wallets(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('wallets');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`wallets-${connection?.user?.user_sub}`).join(connection);
  });
}
