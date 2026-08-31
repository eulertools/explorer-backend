// Initializes the `portfolios` service on path `/portfolios`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Portfolios } from './portfolios.class';
import hooks from './portfolios.hooks';

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

  app.use('/portfolios', new Portfolios(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('portfolios');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`portfolios-${connection?.user?.user_sub}`).join(connection);
  });
}
