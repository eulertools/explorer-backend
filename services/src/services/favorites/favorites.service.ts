// Initializes the `favorites` service on path `/favorites`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Favorites } from './favorites.class';
import hooks from './favorites.hooks';

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

  app.use('/favorites', new Favorites(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('favorites');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`favorites-${connection?.user?.user_sub}`).join(connection);
  });
}
