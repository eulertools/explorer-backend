// Initializes the `blocks` service on path `/blocks`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Blocks } from './blocks.class';
import hooks from './blocks.hooks';

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/blocks', new Blocks(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('blocks');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`blocks-${connection?.user?.user_sub}`).join(connection);
  });
}
