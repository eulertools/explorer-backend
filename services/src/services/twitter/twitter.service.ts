// Initializes the `twitter` service on path `/twitter`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Twitter } from './twitter.class';
import hooks from './twitter.hooks';

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/twitter', new Twitter(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('twitter');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`twitter-${connection?.user?.user_sub}`).join(connection);
  });
}
