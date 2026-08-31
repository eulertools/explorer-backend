// Initializes the `marketplace` service on path `/pairs`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Marketplace } from './marketplace.class';
import hooks from './marketplace.hooks';

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/marketplace', new Marketplace(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('marketplace');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`marketplace-${connection?.user?.user_sub}`).join(connection);
    app.channel('marketplace').join(connection);
  });
}
