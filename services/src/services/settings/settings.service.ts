// Initializes the `wallets` service on path `/wallets`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Settings } from './settings.class';
import hooks from './settings.hooks';

export default function (app: Application): void {
  // Initialize our service with any options it requires

  const options:any = {
    paginate: app.get('paginate'),
  };

  app.use('/settings', new Settings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('settings');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`settings-${connection?.user?.user_sub}`).join(connection);
  });
}
