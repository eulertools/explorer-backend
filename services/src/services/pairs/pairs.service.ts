// Initializes the `pairs` service on path `/pairs`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Pairs } from './pairs.class';
import hooks from './pairs.hooks';

// Add this service to the service type index
export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/pairs', new Pairs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pairs');

  service.hooks(hooks);

  // setup live channel
  service.publish((data: any, context: any) => {
    console.log('published');
    return app.channel('pairs');
  });

  app.on('connection', (connection: any): void => {
    app.channel(`pairs`).join(connection);
  });
}
