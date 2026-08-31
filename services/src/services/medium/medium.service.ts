// Initializes the `medium` service on path `/medium`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Medium } from './medium.class';
import hooks from './medium.hooks';

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/medium', new Medium(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('medium');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`medium-${connection?.user?.user_sub}`).join(connection);
  });
}
