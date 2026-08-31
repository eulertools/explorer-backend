// Initializes the `logs` service on path `/logs`
import { Application } from '../../declarations';
import { Logs } from './logs.class';
import hooks from './logs.hooks';

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };
 
  // Initialize our service with any options it requires
  app.use('/logs', new Logs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('logs');

  service.hooks(hooks);

  // setup live channel
  service.publish((data, context) => {
    return app.channel('logs');
  });

  app.on('connection', (connection: any): void => {
    app.channel('logs').join(connection);
  });
}
