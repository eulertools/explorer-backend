// Initializes the `notifications` service on path `/notifications`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Notifications } from './notifications.class';
import hooks from './notifications.hooks';

export default function (app: Application): void {
  const {
    tables: { userNotifications },
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    table: userNotifications,
    primaryKey: 'identifier',
  };

  // Initialize our service with any options it requires
  app.use('/notifications', new Notifications(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('notifications');

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`notifications-${connection?.user?.user_sub}`).join(connection);
  });

  service.hooks(hooks);
}
