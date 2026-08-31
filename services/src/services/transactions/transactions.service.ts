// Initializes the `transactions` service on path `/transactions`
import { Application } from '../../declarations';
import { channel as channelMiddleware } from '../../middleware/channel';
import { Transactions } from './transactions.class';
import hooks from './transactions.hooks';
import bscHooks from './bsc_transactions.hooks';
import { BscTransactions } from './bsc_transactions.class';

export function transactions(app: Application): void {
  const models = app.get('models');
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/transactions', new Transactions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('transactions');

  service.hooks(hooks);

  // setup live channel
  service.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`transactions-${connection?.user?.user_sub}`).join(connection);
  });
}

export function bsc_transactions(app: Application): void {
  // Initialize our service with any options it requires
  const {
    tables: {bscTransactions},
  } = app.get('dynamodb');
  const optionsBsc = {
    paginate: app.get('paginate'),
    table: bscTransactions,
    primaryKey: 'identifier',
  };
  const bsc = new BscTransactions(optionsBsc, app);

  app.use('/bsc_transactions', bsc);

  // Get our initialized service so that we can register hooks
  const bscService = app.service('bsc_transactions');

  bscService.hooks(bscHooks);

  // setup live channel
  bscService.publish(channelMiddleware);

  app.on('connection', (connection: any): void => {
    app.channel(`bsc_transactions-${connection?.user?.user_sub}`).join(connection);
  });
}
