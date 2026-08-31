// Initializes the `profiles` service on path `/profiles`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Profiles } from './profiles.class';
import hooks from './profiles.hooks';

export default function (app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: { userProfiles },
  } = app.get('dynamodb');
  const options = {
    paginate: app.get('paginate'),
    table: userProfiles,
    primaryKey: 'user_sub',
    prefix: 'none'
  };
  const profiles = new Profiles(options, app);

  app.use('/profiles', profiles);

  // Get our initialized service so that we can register hooks
  const service = app.service('profiles');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`profiles-${connection?.user?.user_sub}`).join(connection);
  });
}
