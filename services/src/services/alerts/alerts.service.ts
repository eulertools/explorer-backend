// Initializes the `alerts` service on path `/alerts`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Alerts } from './alerts.class';
import hooks from './alerts.hooks';

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

  app.use('/alerts', new Alerts(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('alerts');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`alerts-${connection?.user?.user_sub}`).join(connection);
  });
}
