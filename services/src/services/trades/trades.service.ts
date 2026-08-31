// Initializes the `trades` service on path `/trades`
import { Application } from '../../declarations';
import { Trades } from './trades.class';
import hooks from './trades.hooks';

export default function (app: Application): void {
  const options = {
    paginate: {...app.get('paginate')},
  };

  // Initialize our service with any options it requires
  app.use('/trades', new Trades(options, app));

  app.use('/trades/charts', new Trades(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('trades');

  service.hooks(hooks);

  // setup live channel
  service.publish((data: any, context: any) => {
    return app.channel('trades');
  });

  app.on('connection', (connection: any): void => {
    app.channel('trades').join(connection);
  });
}
