// Initializes the `accounts` service on path `/accounts`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Accounts } from './accounts.class';
import hooks from './accounts.hooks';

export default function (app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: { userSubscriptions },
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    table: userSubscriptions,
    primaryKey: 'user_sub',
  };

  const accounts = new Accounts(options, app);

  app.use('/accounts', accounts);

  // Get our initialized service so that we can register hooks
  const service = app.service('accounts');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`accounts-${connection?.user?.user_sub}`).join(connection);
  });
}
